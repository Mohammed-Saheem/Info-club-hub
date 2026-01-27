import { createContext, useContext, useEffect, useState, ReactNode, useRef } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  is_admin: boolean;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  isAdmin: boolean;
  isLoading: boolean;
  profileFetched: boolean;
  lastAuthEvent: string | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileFetched, setProfileFetched] = useState(false);
  const [lastAuthEvent, setLastAuthEvent] = useState<string | null>(null);

  // Ref to track the user ID for which we've fetched/are fetching a profile
  // This helps prevent infinite loops during token refreshes
  const lastFetchedUserId = useRef<string | null>(null);

  // Track if the user explicitly requested to sign out
  const isManualSignOut = useRef(false);

  useEffect(() => {
    // If Supabase is not configured, skip auth setup
    if (!supabase) {
      console.warn("Supabase client is not configured");
      setIsLoading(false);
      setProfileFetched(true);
      return;
    }

    // Flag to track if the listener has handled the initial session
    let initialEventHandled = false;

    // Set up auth state listener
    // IMPORTANT: Keep this listener synchronous and lean to avoid blocking Supabase internal state updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log(`AuthProvider: Auth state changed [${event}]`, session?.user?.email);
        setLastAuthEvent(event);

        if (event === 'SIGNED_OUT') {
          if (isManualSignOut.current) {
            console.log("AuthProvider: Manual sign out detected. Clearing session.");
            isManualSignOut.current = false; // Reset for next time
          } else {
            // Defensive check: Did we really lose the session, or is this a Supabase glitch?
            console.warn("AuthProvider: Auto-logout (SIGNED_OUT) detected without user action. Double-checking...");

            // Wait a tiny bit for any race conditions to settle
            await new Promise(resolve => setTimeout(resolve, 500));

            const { data } = await supabase.auth.getSession();
            if (data.session) {
              console.warn("AuthProvider: 🛡️ FALSE ALARM! Session is still valid. Ignoring SIGNED_OUT event.");
              // Restore/Keep the session
              setSession(data.session);
              setUser(data.session.user);
              return;
            } else {
              console.warn("AuthProvider: Verified session is truly gone.");
            }
          }
        }

        // Track that we've seen at least one event
        initialEventHandled = true;

        // Update local state
        setSession(session);
        setUser(session?.user ?? null);

        if (!session?.user) {
          lastFetchedUserId.current = null;
          setProfile(null);
          setProfileFetched(true);
        }

        // Always mark loading as false once the first event is processed
        setIsLoading(false);
      }
    );

    // Initial session fallback check
    const initSession = async () => {
      try {
        console.log("AuthProvider: Initializing session fallback...");
        const { data: { session } } = await supabase.auth.getSession();

        // If the listener hasn't fired yet, use the initial session data
        if (!initialEventHandled) {
          console.log("AuthProvider: Listener hasn't fired, using getSession data");
          setSession(session);
          setUser(session?.user ?? null);

          if (!session?.user) {
            setProfileFetched(true);
          }
          setIsLoading(false);
        }
      } catch (err) {
        console.error("AuthProvider: Initial session error:", err);
        setProfileFetched(true);
        setIsLoading(false);
      }
    };

    initSession();

    // Safety timeout: Ensure we never hang in loading state 
    // Increased to 15s to handle slower DB responses
    const safetyTimeout = setTimeout(() => {
      if (isLoading || (user && !profileFetched)) {
        console.warn("AuthProvider: ⚠️ Safety timeout reached (15s), forcing loading states to resolve");
        setIsLoading(false);
        setProfileFetched(true);
      }
    }, 15000);

    return () => {
      subscription.unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Separate effect for profile fetching to keep the auth listener non-blocking
  useEffect(() => {
    if (user) {
      const userIdChanged = user.id !== lastFetchedUserId.current;

      if (userIdChanged) {
        console.log(`AuthProvider: User change detected (${user.id}), fetching profile...`);
        setProfile(null);
        setProfileFetched(false);
        fetchProfile(user.id, user.email);
      } else if (!profileFetched && !profile) {
        // Fallback for cases where we have a user but fetch hasn't started
        console.log("AuthProvider: Profile missing for existing user, triggering fetch...");
        fetchProfile(user.id, user.email);
      }
    }
  }, [user, profile, profileFetched]);

  const fetchProfile = async (userId: string, emailHint?: string) => {
    if (!supabase) return;

    // Update ref immediately to prevent overlap
    lastFetchedUserId.current = userId;

    console.log("AuthProvider: Fetching profile for user:", userId);

    try {
      // Fetch the profile directly using the userId
      let { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (!data && !error) {
        // Retry once after a short delay if profile not found immediately (helpful for new signups relying on triggers)
        console.log("AuthProvider: Profile not found immediately, retrying in 1s...");
        await new Promise(resolve => setTimeout(resolve, 1000));
        const retry = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", userId)
          .maybeSingle();
        data = retry.data;
        error = retry.error;
      }

      if (error) {
        console.error("AuthProvider: Error fetching profile:", error.message);
        // Mark as fetched anyway so we don't block the UI forever
      } else if (data) {
        console.log("AuthProvider: ✅ Profile fetched successfully:", data);
        setProfile(data as Profile);
      } else {
        console.warn("AuthProvider: No profile record found for user even after retry. The database trigger might be failing or slow.");
      }
    } catch (err) {
      console.error("AuthProvider: Unexpected profile fetch error:", err);
    } finally {
      setProfileFetched(true);
    }
  };

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      console.error("Supabase client is not configured!");
      return { error: new Error("Supabase is not configured") };
    }
    console.log("Attempting sign in for:", email);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    console.log("Sign in result:", { data, error });
    return { error };
  };

  const signUp = async (email: string, password: string, fullName?: string) => {
    if (!supabase) {
      return { error: new Error("Supabase is not configured") };
    }
    const redirectUrl = `${window.location.origin}/`;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: {
          full_name: fullName,
        },
      },
    });
    return { error };
  };

  const signOut = async () => {
    if (supabase) {
      isManualSignOut.current = true;
      await supabase.auth.signOut();
    }
    // We don't manually reset state here anymore. 
    // The onAuthStateChange listener will handle the 'SIGNED_OUT' event 
    // and naturally reset user, session, profile, and profileFetched.
  };

  // isLoading should be true until BOTH auth check AND profile fetch are complete
  const actuallyLoading = isLoading || (user && !profileFetched);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin: profile?.is_admin ?? false,
        isLoading: actuallyLoading,
        profileFetched,
        lastAuthEvent,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

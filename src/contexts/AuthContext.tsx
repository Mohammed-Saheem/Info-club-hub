import { createContext, useContext, useEffect, useState, ReactNode } from "react";
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

  useEffect(() => {
    // If Supabase is not configured, skip auth setup
    if (!supabase) {
      console.warn("Supabase client is not configured");
      setIsLoading(false);
      setProfileFetched(true);
      return;
    }

    let initialSessionHandled = false;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event, session?.user?.email);
        
        // Skip if this is the initial session - we handle that separately
        if (event === 'INITIAL_SESSION') {
          console.log("Skipping INITIAL_SESSION in listener - handled by getSession");
          return;
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch profile when user changes
        if (session?.user) {
          // IMPORTANT: Reset profileFetched before fetching new profile
          setProfileFetched(false);
          setProfile(null);
          // Use setTimeout to avoid blocking auth state update
          setTimeout(async () => {
            await fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
          setProfileFetched(true);
        }
      }
    );

    // Check for existing session
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Initial session check:", session?.user?.email || "No session");
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          await fetchProfile(session.user.id);
        } else {
          setProfileFetched(true);
        }
      } catch (err) {
        console.error("Error getting session:", err);
        setProfileFetched(true);
      } finally {
        initialSessionHandled = true;
        setIsLoading(false);
      }
    };
    
    initSession();

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    if (!supabase) {
      console.warn("Supabase not configured, skipping profile fetch");
      setProfileFetched(true);
      return;
    }
    
    console.log("Fetching profile for user:", userId);
    
    try {
      // Get the current user email
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      const userEmail = currentUser?.email || '';

      // First, attempt to fetch the profile
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching profile:", error.message, error.details, error.hint);
        console.error("Error code:", error.code);
        
        // If there's an error, try to create the profile anyway
        console.warn("Attempting to create profile after fetch error...");
        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            email: userEmail,
            full_name: currentUser?.user_metadata?.full_name || null,
            is_admin: false
          })
          .select()
          .maybeSingle();
        
        if (createError) {
          console.error("Failed to create profile:", createError);
          // Even if creation fails, mark as fetched to unblock the UI
          // The user might still be able to use the app
        } else if (createdProfile) {
          console.log("✅ Profile created:", createdProfile);
          setProfile(createdProfile as Profile);
        }
      } else if (data) {
        console.log("✅ Profile fetched successfully:", data);
        setProfile(data as Profile);
      } else {
        console.warn("No profile found for user, attempting to create one...");
        const { data: createdProfile, error: createError } = await supabase
          .from("profiles")
          .insert({
            user_id: userId,
            email: userEmail,
            full_name: currentUser?.user_metadata?.full_name || null,
            is_admin: false
          })
          .select()
          .maybeSingle();
        
        if (createError) {
          console.error("Failed to create profile:", createError);
        } else if (createdProfile) {
          console.log("✅ Profile created:", createdProfile);
          setProfile(createdProfile as Profile);
        }
      }
    } catch (err) {
      console.error("Unexpected error fetching/creating profile:", err);
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
      await supabase.auth.signOut();
    }
    setProfile(null);
    setProfileFetched(false);
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

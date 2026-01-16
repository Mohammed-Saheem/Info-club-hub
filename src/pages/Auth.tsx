import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { user, profile, isAdmin, isLoading: authLoading, profileFetched, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("=== AUTH PAGE STATE ===");
    console.log("user:", user ? user.email : null);
    console.log("profile:", profile);
    console.log("isAdmin:", isAdmin);
    console.log("authLoading:", authLoading);
    console.log("profileFetched:", profileFetched);
    console.log("loginSuccess:", loginSuccess);
    console.log("========================");
  }, [user, profile, isAdmin, authLoading, profileFetched, loginSuccess]);

  // Handle redirect after successful login
  useEffect(() => {
    // Wait for login success AND user to be set AND auth loading to complete AND profile fetched
    if (loginSuccess && user && !authLoading && profileFetched) {
      console.log("=== LOGIN SUCCESS - CHECKING REDIRECT ===");
      console.log("profile:", profile);
      console.log("isAdmin:", isAdmin);
      
      if (profile) {
        if (isAdmin) {
          console.log("✅ Redirecting to admin...");
          navigate("/admin", { replace: true });
        } else {
          console.log("❌ User is not admin, redirecting to home");
          toast.error("You don't have admin access. Contact administrator to get admin privileges.");
          setLoginSuccess(false);
          setIsSubmitting(false);
          navigate("/", { replace: true });
        }
      } else {
        // Profile not found - could be RLS issue or trigger didn't run
        console.error("❌ No profile found for user:", user.id, user.email);
        console.error("Possible causes:");
        console.error("1. Profile trigger didn't run during signup");
        console.error("2. RLS policy blocking profile read");
        console.error("3. Profile was deleted");
        toast.error("Profile not found. This might be an RLS issue - check Supabase console.");
        setLoginSuccess(false);
        setIsSubmitting(false);
      }
    }
  }, [loginSuccess, user, profile, isAdmin, authLoading, profileFetched, navigate]);

  // Timeout fallback - if stuck loading for too long
  useEffect(() => {
    if (loginSuccess && isSubmitting) {
      const timeout = setTimeout(() => {
        console.error("Login timeout - stuck in loading state");
        toast.error("Login timeout. Please check your connection and try again.");
        setLoginSuccess(false);
        setIsSubmitting(false);
      }, 10000); // 10 second timeout

      return () => clearTimeout(timeout);
    }
  }, [loginSuccess, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isLogin) {
      console.log("Attempting sign in for:", email);
      const { error } = await signIn(email, password);

      if (error) {
        console.error("Sign in error:", error);
        toast.error(error.message || "Login failed. Please try again.");
        setIsSubmitting(false);
      } else {
        console.log("Sign in successful, waiting for auth state...");
        toast.success("Logged in successfully!");
        setLoginSuccess(true);
        // Keep isSubmitting true - will be reset after redirect or timeout
      }
    } else {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Account created! You can now log in.");
        setIsLogin(true);
      }
      setIsSubmitting(false);
    }
  };

  // Handle redirect for already logged in users (must be in useEffect, not during render)
  useEffect(() => {
    if (user && profileFetched && !loginSuccess && !isSubmitting) {
      if (profile && isAdmin) {
        console.log("Already logged in as admin, redirecting to /admin");
        navigate("/admin", { replace: true });
      } else if (profile) {
        console.log("Already logged in but not admin, redirecting to /");
        navigate("/", { replace: true });
      }
      // If no profile, stay on auth page - something is wrong
    }
  }, [user, profile, isAdmin, profileFetched, loginSuccess, isSubmitting, navigate]);

  // Show loading state while checking existing session
  if (authLoading && !isSubmitting) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Checking session...</p>
        </div>
      </div>
    );
  }

  // If already logged in and redirect is pending, show loading
  if (user && profileFetched && !loginSuccess) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 overflow-hidden rounded-xl">
              <img
                src="/INFOCLUB[1].jpg"
                alt="INFO CLUB Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="font-display text-2xl font-bold text-foreground">{isLogin ? "Welcome Back" : "Create Account"}</h1>
            <p className="text-muted-foreground text-sm mt-2">Admin access only</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && <Input placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />}
            <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isSubmitting} />
            <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} disabled={isSubmitting} />
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></span>
                  {loginSuccess ? "Verifying access..." : "Signing in..."}
                </span>
              ) : isLogin ? "Sign In" : "Sign Up"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button onClick={() => setIsLogin(!isLogin)} className="text-primary text-sm hover:underline">
              {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

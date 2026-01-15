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
  const { user, profile, isAdmin, isLoading: authLoading, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log("Auth state:", { user: !!user, profile, isAdmin, authLoading, loginSuccess });
  }, [user, profile, isAdmin, authLoading, loginSuccess]);

  // Handle redirect after successful login
  useEffect(() => {
    // Wait for login success AND user to be set AND auth loading to complete
    if (loginSuccess && user && !authLoading) {
      // Give a small delay for profile to be fetched
      const timer = setTimeout(() => {
        if (profile) {
          if (isAdmin) {
            console.log("Redirecting to admin...");
            navigate("/admin", { replace: true });
          } else {
            toast.error("You don't have admin access");
            setLoginSuccess(false);
            setIsSubmitting(false);
            navigate("/", { replace: true });
          }
        } else {
          // Profile not found - likely missing from database
          console.error("No profile found for user. Check if profile exists in database.");
          toast.error("Profile not found. Please contact administrator.");
          setLoginSuccess(false);
          setIsSubmitting(false);
        }
      }, 500); // Small delay to allow profile fetch
      
      return () => clearTimeout(timer);
    }
  }, [loginSuccess, user, profile, isAdmin, authLoading, navigate]);

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

  // Already logged in - redirect
  if (user && profile && !loginSuccess) {
    if (isAdmin) {
      navigate("/admin", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-card rounded-2xl border border-border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-xl bg-primary mx-auto mb-4 flex items-center justify-center">
              <span className="font-display font-bold text-primary-foreground text-2xl">IC</span>
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

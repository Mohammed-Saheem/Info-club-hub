import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Calendar, Users, Image, Mail, LogOut, Home, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/team", icon: Users, label: "Team" },
  { href: "/admin/gallery", icon: Image, label: "Gallery" },
  { href: "/admin/submissions", icon: Mail, label: "Submissions" },
  { href: "/admin/users", icon: UserCog, label: "Users" },
];

export default function AdminLayout() {
  const { user, isAdmin, isLoading, profileFetched, signOut, lastAuthEvent } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if auth loading AND profile fetching are complete
    if (!isLoading && profileFetched) {
      if (!user) {
        console.warn(`AdminLayout: No user session found at ${location.pathname}. showing login prompt instead of redirecting.`);
        // operate in "soft" mode - don't redirect, just let the render handle it
      } else if (isAdmin) {
        console.log(`AdminLayout: ✅ Admin access verified for ${user.email}`);
      }
      // Note: We NO LONGER redirect if !isAdmin. We show a "Access Denied" screen instead.
    }
  }, [user, isAdmin, isLoading, profileFetched, navigate, location.pathname]);

  // Show loading while auth state is being determined
  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  // Show session expired if user is null (and we are not loading)
  if (!user) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold">Session Ended</h1>
          <p className="text-muted-foreground">
            Your session has expired or you are not logged in.
          </p>

          {lastAuthEvent && (
            <div className="p-3 bg-muted/50 rounded text-xs font-mono text-muted-foreground">
              Last Event: {lastAuthEvent}
            </div>
          )}

          <Button onClick={() => navigate("/auth")}>
            Sign In Again
          </Button>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
            <LogOut className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="text-muted-foreground">
            You do not have administrator privileges to access this dashboard.
          </p>
          <div className="p-4 bg-muted/50 rounded-lg text-sm text-left font-mono">
            <p>User: {user?.email}</p>
            <p>ID: {user?.id}</p>
          </div>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={() => navigate("/")}>
              Return Home
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Log Out
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col fixed h-full overflow-y-auto">
        <div className="flex items-center gap-2 mb-8 flex-shrink-0">
          <img
            src="/INFOCLUB[1].jpg"
            alt="INFO CLUB Logo"
            className="w-10 h-10 rounded-lg object-cover"
          />
          <span className="font-display font-bold text-lg">Admin</span>
        </div>
        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} to={item.href} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${location.pathname === item.href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <item.icon className="w-5 h-5" /> {item.label}
            </Link>
          ))}
        </nav>
        <div className="space-y-2 pt-4 border-t border-border mt-auto flex-shrink-0">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted"><Home className="w-5 h-5" /> View Site</Link>
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full text-left"><LogOut className="w-5 h-5" /> Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto ml-64"><Outlet /></main>
    </div>
  );
}

import { useEffect } from "react";
import { Outlet, useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { LayoutDashboard, Calendar, Code, Users, Image, Mail, LogOut, Home, UserCog } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/admin/events", icon: Calendar, label: "Events" },
  { href: "/admin/projects", icon: Code, label: "Projects" },
  { href: "/admin/team", icon: Users, label: "Team" },
  { href: "/admin/gallery", icon: Image, label: "Gallery" },
  { href: "/admin/submissions", icon: Mail, label: "Submissions" },
  { href: "/admin/users", icon: UserCog, label: "Users" },
];

export default function AdminLayout() {
  const { user, isAdmin, isLoading, profileFetched, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if auth loading AND profile fetching are complete
    if (!isLoading && profileFetched) {
      if (!user) {
        console.warn(`AdminLayout: No user session found at ${location.pathname}. Redirecting to /auth`);
        navigate("/auth", { replace: true });
      } else if (!isAdmin) {
        console.warn(`AdminLayout: User ${user.email} is NOT an admin. Redirecting to home`);
        navigate("/", { replace: true });
      } else {
        console.log(`AdminLayout: ✅ Admin access verified for ${user.email}`);
      }
    }
  }, [user, isAdmin, isLoading, profileFetched, navigate, location.pathname]);

  // Show loading while auth state is being determined
  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  // Show loading while waiting for user data to be populated (handles race condition)
  if (!user) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" /></div>;

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex">
      <aside className="w-64 bg-card border-r border-border p-4 flex flex-col">
        <div className="flex items-center gap-2 mb-8">
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
        <div className="space-y-2 pt-4 border-t border-border">
          <Link to="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted"><Home className="w-5 h-5" /> View Site</Link>
          <button onClick={signOut} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 w-full"><LogOut className="w-5 h-5" /> Sign Out</button>
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto"><Outlet /></main>
    </div>
  );
}

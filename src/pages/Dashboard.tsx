import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Bell, LogOut, Settings, User } from "lucide-react";

const Dashboard = () => {
  // Hooks
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been signed out of your account.",
    });
    window.location.replace("/auth/signin");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            NotifyForYou
          </span>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 text-white mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">
                  Welcome{user?.email ? `, ${user.email.split("@")[0]}` : ""}!
                </h1>
                <p className="text-white/80">
                  Your account is active and ready to use.
                </p>
              </div>
            </div>
            <p className="text-white/90">
              This is your dashboard. More features coming soon!
            </p>
          </div>

          {/* Placeholder Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <h3 className="font-semibold text-lg mb-2">Notifications</h3>
              <p className="text-muted-foreground text-sm">
                Manage your notification preferences and history.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <h3 className="font-semibold text-lg mb-2">Analytics</h3>
              <p className="text-muted-foreground text-sm">
                View your engagement metrics and insights.
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-border/50">
              <h3 className="font-semibold text-lg mb-2">Settings</h3>
              <p className="text-muted-foreground text-sm">
                Configure your account and preferences.
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;

import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Bell, Calendar, Users, CheckCircle2, Clock } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="hero-gradient min-h-screen pt-32 pb-16 overflow-hidden relative">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-secondary/30 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary rounded-full mb-6">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-sm font-medium text-secondary-foreground">
                Smart reminders for everyone
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Never miss a deadline, payment, or{" "}
              <span className="text-gradient">follow-up</span> again.
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
              Smart task reminders and intelligent escalation for individuals, teams, 
              and organizations. Stay organized, stay notified, stay stress-free.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button variant="hero" size="xl">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                <Play className="w-5 h-5" />
                See How It Works
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>Free to start</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-accent" />
                <span>No credit card</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Dashboard Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="glass-card rounded-2xl p-6 shadow-glow">
              {/* Dashboard Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl btn-gradient flex items-center justify-center">
                    <Bell className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Today's Tasks</h3>
                    <p className="text-sm text-muted-foreground">4 reminders active</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium">
                  Priority
                </span>
              </div>

              {/* Task Items */}
              <div className="space-y-3">
                {[
                  { icon: Calendar, title: "GST Payment Due", time: "Today 5:00 PM", priority: "high" },
                  { icon: Users, title: "Client Follow-up: Acme Corp", time: "Tomorrow 10:00 AM", priority: "medium" },
                  { icon: Clock, title: "License Renewal", time: "In 3 days", priority: "low" },
                ].map((task, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                    className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer ${
                      task.priority === "high"
                        ? "bg-destructive/5 border border-destructive/20"
                        : task.priority === "medium"
                        ? "bg-primary/5 border border-primary/20"
                        : "bg-muted border border-transparent"
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      task.priority === "high"
                        ? "bg-destructive/10"
                        : task.priority === "medium"
                        ? "bg-primary/10"
                        : "bg-muted-foreground/10"
                    }`}>
                      <task.icon className={`w-5 h-5 ${
                        task.priority === "high"
                          ? "text-destructive"
                          : task.priority === "medium"
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground">{task.title}</h4>
                      <p className="text-sm text-muted-foreground">{task.time}</p>
                    </div>
                    <CheckCircle2 className="w-5 h-5 text-muted-foreground/30 hover:text-accent transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Floating notification card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="absolute -bottom-4 -left-4 glass-card rounded-xl p-4 shadow-lg animate-float"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Bell className="w-4 h-4 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Reminder sent!</p>
                  <p className="text-xs text-muted-foreground">Team notified</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

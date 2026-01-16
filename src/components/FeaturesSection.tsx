import { 
  Zap, 
  Receipt, 
  MessageSquare, 
  Building2, 
  LayoutDashboard, 
  Mail 
} from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Zap,
    title: "Smart Escalation",
    description: "Reminders automatically intensify as deadlines approach",
    color: "primary",
  },
  {
    icon: Receipt,
    title: "Bill & Expiry Tracking",
    description: "Never miss a payment, license, or subscription renewal",
    color: "accent",
  },
  {
    icon: MessageSquare,
    title: "Client Follow-ups",
    description: "Track conversations with notes and comments",
    color: "secondary",
  },
  {
    icon: Building2,
    title: "Organization Support",
    description: "Departments, roles, and team structures built-in",
    color: "primary",
  },
  {
    icon: LayoutDashboard,
    title: "Priority Dashboard",
    description: "See what matters most at a glance",
    color: "accent",
  },
  {
    icon: Mail,
    title: "Multi-channel Alerts",
    description: "Email and in-app notifications keep you informed",
    color: "secondary",
  },
];

const colorClasses = {
  primary: {
    bg: "bg-primary/10",
    icon: "text-primary",
    border: "border-primary/20 hover:border-primary/40",
  },
  accent: {
    bg: "bg-accent/10",
    icon: "text-accent",
    border: "border-accent/20 hover:border-accent/40",
  },
  secondary: {
    bg: "bg-secondary",
    icon: "text-secondary-foreground",
    border: "border-secondary-foreground/10 hover:border-secondary-foreground/30",
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-primary/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[300px] h-[300px] bg-accent/3 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Everything you need to stay organized
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Powerful features designed to help you, your team, and your organization never miss a beat.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const colors = colorClasses[feature.color as keyof typeof colorClasses];
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className={`group p-6 rounded-2xl bg-card border ${colors.border} transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
              >
                <div className={`w-14 h-14 rounded-xl ${colors.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-7 h-7 ${colors.icon}`} />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

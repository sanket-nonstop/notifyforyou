import { User, Users, Building2, Receipt, MessageSquare, FileCheck } from "lucide-react";
import { motion } from "framer-motion";

const userTypes = [
  {
    icon: User,
    title: "Individuals",
    description: "Personal reminders for bills, appointments, and important dates",
    color: "primary",
  },
  {
    icon: Users,
    title: "Teams",
    description: "Shared tasks with assignments, handoffs, and accountability",
    color: "accent",
  },
  {
    icon: Building2,
    title: "Organizations",
    description: "Department-level tracking with roles and escalation chains",
    color: "secondary",
  },
];

const examples = [
  {
    icon: Receipt,
    text: "Paying GST or electricity bills on time",
  },
  {
    icon: MessageSquare,
    text: "Following up with clients before they go cold",
  },
  {
    icon: FileCheck,
    text: "Renewing licenses, subscriptions, and contracts",
  },
];

const UseCasesSection = () => {
  return (
    <section id="use-cases" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-[350px] h-[350px] bg-primary/3 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-4">
            Use Cases
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Built for how you work
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're a solo professional or part of a large organization, NotifyForYou adapts to your needs.
          </p>
        </motion.div>

        {/* User Types */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {userTypes.map((type, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`group p-8 rounded-2xl bg-gradient-to-b from-white to-muted/30 border border-border hover:shadow-xl transition-all duration-300 hover:-translate-y-1`}
            >
              <div className={`w-16 h-16 rounded-2xl ${
                type.color === "primary" ? "btn-gradient" :
                type.color === "accent" ? "accent-gradient" :
                "bg-secondary"
              } flex items-center justify-center mb-6 shadow-soft group-hover:scale-110 transition-transform duration-300`}>
                <type.icon className={`w-8 h-8 ${
                  type.color === "secondary" ? "text-secondary-foreground" : "text-primary-foreground"
                }`} />
              </div>
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                {type.title}
              </h3>
              <p className="text-muted-foreground text-lg">
                {type.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Examples */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 md:p-10"
        >
          <h3 className="text-xl font-semibold text-foreground mb-6 text-center">
            Real-world examples
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            {examples.map((example, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="flex items-center gap-4 p-4 rounded-xl bg-white/60 border border-white/80"
              >
                <div className="w-12 h-12 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
                  <example.icon className="w-6 h-6 text-primary" />
                </div>
                <p className="text-foreground font-medium">{example.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;

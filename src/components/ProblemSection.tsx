import { CreditCard, MessageSquareX, AlertTriangle, Users } from "lucide-react";
import { motion } from "framer-motion";

const problems = [
  {
    icon: CreditCard,
    title: "Missed bill payments",
    description: "Late fees pile up when payments slip through the cracks",
  },
  {
    icon: MessageSquareX,
    title: "Forgotten follow-ups",
    description: "Clients wait too long, deals go cold, trust erodes",
  },
  {
    icon: AlertTriangle,
    title: "No task visibility",
    description: "Urgent items get buried under daily chaos",
  },
  {
    icon: Users,
    title: "Poor coordination",
    description: "Team members miss handoffs and deadlines",
  },
];

const ProblemSection = () => {
  return (
    <section className="section-padding bg-white relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-destructive/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 bg-destructive/10 text-destructive rounded-full text-sm font-medium mb-4">
            The Problem
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Things slip through the cracks
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Without a reliable system, important tasks get forgotten and opportunities are lost.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {problems.map((problem, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-card border border-destructive/10 hover:border-destructive/30 transition-all duration-300 hover:shadow-lg"
            >
              <div className="w-14 h-14 rounded-xl bg-destructive/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <problem.icon className="w-7 h-7 text-destructive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {problem.title}
              </h3>
              <p className="text-muted-foreground">
                {problem.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;

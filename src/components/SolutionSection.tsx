import { CheckCircle2, Zap, Bell, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const solutions = [
  {
    icon: CheckCircle2,
    title: "Create tasks for everything",
    description: "Bills, renewals, follow-ups, deadlines — all in one place",
  },
  {
    icon: Users,
    title: "Assign to anyone",
    description: "Individuals, teams, or entire departments",
  },
  {
    icon: Zap,
    title: "Smart escalation",
    description: "Reminders that get more urgent as deadlines approach",
  },
  {
    icon: Bell,
    title: "Notify the right people",
    description: "Email and in-app alerts at exactly the right time",
  },
];

const SolutionSection = () => {
  return (
    <section className="section-padding hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-3xl" />
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
            The Solution
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            NotifyForYou keeps you on track
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A smart reminder system that ensures nothing falls through the cracks.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {solutions.map((solution, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group flex gap-5 p-6 rounded-2xl bg-white/80 backdrop-blur-sm border border-white/60 hover:shadow-lg transition-all duration-300"
            >
              <div className="w-14 h-14 shrink-0 rounded-xl btn-gradient flex items-center justify-center shadow-soft group-hover:scale-110 transition-transform duration-300">
                <solution.icon className="w-7 h-7 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                  {solution.title}
                  <ArrowRight className="w-4 h-4 text-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                </h3>
                <p className="text-muted-foreground">
                  {solution.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionSection;

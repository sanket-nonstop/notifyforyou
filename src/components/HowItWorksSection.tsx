import { PlusCircle, Settings, BellRing, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    icon: PlusCircle,
    title: "Create a task",
    description: "Add bills, renewals, follow-ups, or any deadline that matters",
  },
  {
    number: "02",
    icon: Settings,
    title: "Set reminder rules",
    description: "Assign people, choose timing, and configure escalation",
  },
  {
    number: "03",
    icon: BellRing,
    title: "Stay notified",
    description: "Get alerts at the right time and never miss a deadline",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="section-padding hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-3xl" />
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
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Three simple steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get started in minutes and take control of your tasks and deadlines.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.15 }}
              className="relative"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-[calc(50%+40px)] right-[-40px] h-0.5">
                  <div className="h-full w-full bg-gradient-to-r from-primary/40 to-primary/10" />
                  <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/40" />
                </div>
              )}

              <div className="flex flex-col items-center text-center">
                {/* Step number badge */}
                <div className="relative mb-6">
                  <div className="w-20 h-20 rounded-2xl btn-gradient flex items-center justify-center shadow-lg">
                    <step.icon className="w-9 h-9 text-primary-foreground" />
                  </div>
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-soft flex items-center justify-center text-sm font-bold text-primary">
                    {step.number}
                  </span>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground max-w-xs">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

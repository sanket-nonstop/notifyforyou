import { Shield, BellOff, CheckCircle, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const trustPoints = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and protected",
  },
  {
    icon: BellOff,
    title: "No Spam",
    description: "Only meaningful notifications, never noise",
  },
  {
    icon: CheckCircle,
    title: "Reliable",
    description: "99.9% uptime, always there when you need it",
  },
  {
    icon: TrendingUp,
    title: "Scalable",
    description: "Grows with you from solo to enterprise",
  },
];

const TrustSection = () => {
  return (
    <section className="section-padding hero-gradient relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Built on trust & reliability
          </h2>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            We take security and reliability seriously, so you can focus on what matters.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {trustPoints.map((point, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="text-center p-6"
            >
              <div className="w-14 h-14 mx-auto rounded-xl bg-white/80 backdrop-blur-sm border border-white/60 shadow-soft flex items-center justify-center mb-4">
                <point.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {point.title}
              </h3>
              <p className="text-muted-foreground text-sm">
                {point.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustSection;

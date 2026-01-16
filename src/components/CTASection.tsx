import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const CTASection = () => {
  return (
    <section id="contact" className="section-padding bg-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary/30 rounded-full blur-3xl" />
      </div>

      <div className="container-narrow relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Start your journey today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6 leading-tight">
            Stay organized. Stay notified.{" "}
            <span className="text-gradient">Stay stress-free.</span>
          </h2>

          <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-xl mx-auto">
            Join thousands of individuals and teams who never miss a deadline with NotifyForYou.
          </p>

          <Button variant="hero" size="xl" className="mb-6">
            Get Started with NotifyForYou
            <ArrowRight className="w-5 h-5" />
          </Button>

          <p className="text-sm text-muted-foreground">
            Free to start • No credit card required
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

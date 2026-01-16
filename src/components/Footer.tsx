import { Bell } from "lucide-react";

const Footer = () => {
  const links = {
    product: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Use Cases", href: "#use-cases" },
      { label: "About", href: "#" },
      { label: "Contact", href: "#contact" },
    ],
    "Quick Links": [
      { label: "Signin", href: "/auth/signin" },
      { label: "Signup", href: "/auth/signup" },
      { label: "Forgot Password", href: "/auth/forgot-password" },
    ],
    legal: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
    ],
  };

  return (
    <footer className="bg-foreground text-primary-foreground py-16">
      <div className="container-narrow">
        <div className="grid md:grid-cols-4 gap-10 md:gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">NotifyForYou</span>
            </a>
            <p className="text-primary-foreground/70 text-sm">
              Smart task reminders and follow-up tracking for individuals,
              teams, and organizations.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-3">
              {links.product.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-3">
              {links["Quick Links"].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-3">
              {links.legal.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors text-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} NotifyForYou. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">notifyforyou.com</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

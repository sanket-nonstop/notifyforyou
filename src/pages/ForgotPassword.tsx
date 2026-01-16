import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ApiError, forgotPassword } from "@/lib/api/auth";
import { validateEmail, validatePhone } from "@/lib/validators";
import { motion } from "framer-motion";
import { ArrowLeft, KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();

  // States
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [identifierError, setIdentifierError] = useState("");

  // Handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier.trim()) {
      setIdentifierError("Email or phone is required");
      return;
    } else if (!validateEmail(identifier) && !validatePhone(identifier)) {
      setIdentifierError("Please enter a valid email or phone number");
      return;
    }

    setIsSending(true);

    try {
      const response = await forgotPassword({ identifier });

      toast({
        title: "Reset link sent!",
        description: "Check your email for the password reset link.",
      });

      navigate(
        `/auth/reset-password?sessionToken=${response.data.sessionToken}`,
        { replace: true }
      );
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "Reset link not sent",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <KeyRound className="w-8 h-8 text-primary" />
            </div>
            {/* <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NotifyForYou
              </span>
            </Link> */}
            <h1 className="text-2xl font-bold text-foreground">
              Forgot password?
            </h1>
            <p className="text-muted-foreground mt-2">
              No worries, we'll send you reset instructions.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="emailOrPhone">Email or Phone</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="emailOrPhone"
                    name="emailOrPhone"
                    type="text"
                    placeholder="Enter your email"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      setIdentifierError("");
                    }}
                    className={`pl-10 ${
                      identifierError ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {identifierError && (
                  <p className="text-sm text-destructive">{identifierError}</p>
                )}
              </div>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                className="w-full"
                disabled={isSending}
              >
                {isSending ? "Sending..." : "Send Reset Link"}
              </Button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Mail className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-muted-foreground">
                We've sent a password reset link to
                <br />
                <span className="font-medium text-foreground">
                  {identifier}
                </span>
              </p>
              <Link to="/reset-password">
                <Button variant="hero" size="lg" className="w-full mt-4">
                  Continue to Reset Password
                </Button>
              </Link>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm text-primary hover:underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link
              to="/auth/signin"
              className="text-primary font-medium hover:underline"
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;

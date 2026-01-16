import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import {
  ApiError,
  resendOtp,
  validateOtpSession,
  verifyOtp,
} from "@/lib/api/auth";
import { motion } from "framer-motion";
import { AlertCircle, ArrowLeft, CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const Verify = () => {
  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();

  // Queries
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");

  // States
  const [isValidating, setIsValidating] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isSessionValid, setIsSessionValid] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [resendTimer, setResendTimer] = useState(60);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  // Validate session on mount
  useEffect(() => {
    const validateSessionToken = async () => {
      if (!sessionToken) {
        toast({
          title: "Invalid session",
          description: "No session token provided. Please sign up again.",
          variant: "destructive",
        });

        navigate("/auth/signup", { replace: true });
        return;
      }

      try {
        const res = await validateOtpSession({ sessionToken });

        const { email, username, phoneNumber } = res.data || {};
        setIdentifier(email || phoneNumber || username);

        setIsSessionValid(true);
        setIsValidating(false);
      } catch (error) {
        if (error instanceof ApiError) {
          toast({
            title: "Session expired",
            description: error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description: "Failed to validate session. Please sign up again.",
            variant: "destructive",
          });
        }

        navigate("/auth/signin", { replace: true });
      }
    };

    validateSessionToken();
  }, [sessionToken, navigate, toast]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");

    // Move to next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = [...otp];
    pastedData.split("").forEach((char, index) => {
      if (index < 6) newOtp[index] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
  };

  const validateOtpInput = () => {
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtpInput() || !sessionToken) return;

    setIsLoading(true);

    try {
      const response = await verifyOtp({
        sessionToken,
        otp: otp.join(""),
      });

      toast({
        title: "Email verified successfully!",
        description: response.message,
      });

      navigate("/auth/signin", { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        toast({
          title: "Verification failed",
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
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;

    setIsResendingOtp(true);

    try {
      const response = await resendOtp({ identifier });

      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your email.",
      });

      setResendTimer(60);

      navigate(`/auth/verify?sessionToken=${response.data.sessionToken}`, {
        replace: true,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setError(error.message);
        toast({
          title: "OTP delivery failed",
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
      setIsResendingOtp(false);
    }
  };

  // Show loading state while validating session
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Validating your session...</p>
        </motion.div>
      </div>
    );
  }

  // Show error state if session is invalid
  if (!isSessionValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <AlertCircle className="w-12 h-12 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Session Invalid</h2>
          <p className="text-muted-foreground mb-4">
            Your verification session has expired or is invalid.
          </p>
          <Button onClick={() => navigate("/auth/signup")}>
            Go to Sign Up
          </Button>
        </motion.div>
      </div>
    );
  }

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
          replace
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border/50">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            {/* <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NotifyForYou
              </span>
            </Link> */}
            <h1 className="text-2xl font-bold text-foreground">
              Verify your email
            </h1>
            <p className="text-muted-foreground mt-2">
              We've sent a 6-digit code to your email.
              <br />
              Enter the code below to verify.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex justify-center gap-3" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-xl font-semibold ${
                      error ? "border-destructive" : ""
                    }`}
                  />
                ))}
              </div>

              {error && (
                <p className="text-sm text-destructive text-center mt-3">
                  {error}
                </p>
              )}
            </div>

            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </Button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                onClick={handleResend}
                disabled={isResendingOtp || resendTimer > 0}
                className={`font-medium ${
                  isResendingOtp || resendTimer > 0
                    ? "text-muted-foreground cursor-not-allowed"
                    : "text-primary hover:underline"
                }`}
              >
                {resendTimer > 0
                  ? `Resend in ${resendTimer}s`
                  : `${isResendingOtp ? "Resending.." : "Resend code"}`}
              </button>
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            <Link
              to="/auth/signin"
              className="text-primary font-medium hover:underline"
              replace
            >
              Back to Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Verify;

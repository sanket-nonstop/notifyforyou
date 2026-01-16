import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  ApiError,
  resendForgotPasswordOtp,
  resetPassword,
  validateForgotPasswordOtpSession,
} from "@/lib/api/auth";
import { motion } from "framer-motion";
import {
  AlertCircle,
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

const ResetPassword = () => {
  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();

  // Queries
  const [searchParams] = useSearchParams();
  const sessionToken = searchParams.get("sessionToken");

  // Session validation states
  const [isValidating, setIsValidating] = useState(true);
  const [isSessionValid, setIsSessionValid] = useState(false);
  const [identifier, setIdentifier] = useState("");

  // Form states
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    otp: "",
    password: "",
    confirmPassword: "",
  });

  // Resend OTP states
  const [resendTimer, setResendTimer] = useState(60);
  const [isResendingOtp, setIsResendingOtp] = useState(false);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Validate session on mount
  useEffect(() => {
    const validateSession = async () => {
      if (!sessionToken) {
        toast({
          title: "Invalid session",
          description: "Please request a new password reset link.",
          variant: "destructive",
        });
        navigate("/auth/forgot-password", { replace: true });
        return;
      }

      try {
        const res = await validateForgotPasswordOtpSession({
          sessionToken,
        });

        const { email, phoneNumber, username } = res.data || {};
        setIdentifier(email || phoneNumber || username);

        setIsSessionValid(true);
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
            description: "Failed to validate session. Please send again.",
            variant: "destructive",
          });
        }

        navigate("/auth/forgot-password", { replace: true });
      } finally {
        setIsValidating(false);
      }
    };

    validateSession();
  }, [sessionToken, navigate, toast]);

  // Resend timer countdown
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  // Handlers
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setErrors((prev) => ({ ...prev, otp: "" }));

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = { otp: "", password: "", confirmPassword: "" };
    let isValid = true;

    const otpString = otp.join("");
    if (otpString.length !== 6) {
      newErrors.otp = "Please enter all 6 digits";
      isValid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must include uppercase, lowercase, and number";
      isValid = false;
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
      isValid = false;
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !sessionToken) return;

    setIsLoading(true);

    try {
      const response = await resetPassword({
        otp: otp.join(""),
        sessionToken,
        newPassword: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      toast({
        title: "Password reset successful!",
        description:
          response.message || "You can now sign in with your new password.",
      });

      navigate("/auth/signin", { replace: true });
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to reset password.";
      setErrors((prev) => ({ ...prev, otp: message }));
      toast({
        title: "Reset failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0 || !identifier) return;

    setIsResendingOtp(true);

    try {
      const response = await resendForgotPasswordOtp({ identifier });

      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent.",
      });

      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);
      setErrors({ otp: "", password: "", confirmPassword: "" });

      // Update URL with new session token
      navigate(
        `/auth/reset-password?sessionToken=${response.data.sessionToken}`,
        { replace: true }
      );
    } catch (error) {
      const message =
        error instanceof ApiError ? error.message : "Failed to resend code.";
      toast({
        title: "Resend failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsResendingOtp(false);
    }
  };

  // Loading state while validating session
  if (isValidating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Validating your session...</p>
        </motion.div>
      </div>
    );
  }

  // Error state for invalid session
  if (!isSessionValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md text-center"
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-border/50">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Session Invalid
            </h1>
            <p className="text-muted-foreground mb-6">
              Your password reset session has expired or is invalid. Please
              request a new one.
            </p>
            <Button
              variant="hero"
              size="lg"
              className="w-full"
              onClick={() =>
                navigate("/auth/forgot-password", { replace: true })
              }
            >
              Request New Reset Link
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/10 flex items-center justify-center p-4 py-8">
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
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">
              Reset your password
            </h1>
            <p className="text-muted-foreground mt-2">
              Enter the code sent to{" "}
              <span className="font-medium text-foreground">
                {identifier || "your email"}
              </span>{" "}
              and create a new password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <div className="flex justify-center gap-2" onPaste={handlePaste}>
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className={`w-11 h-12 text-center text-lg font-semibold ${
                      errors.otp ? "border-destructive" : ""
                    }`}
                  />
                ))}
              </div>
              {errors.otp && (
                <p className="text-sm text-destructive text-center">
                  {errors.otp}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${
                    errors.password ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
              <p className="text-xs text-muted-foreground">
                Must be 8+ characters with uppercase, lowercase, and number
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className={`pl-10 pr-10 ${
                    errors.confirmPassword ? "border-destructive" : ""
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">
                  {errors.confirmPassword}
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
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </form>

          {/* Resend OTP Section */}
          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Didn't receive the code?{" "}
              <button
                type="button"
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
                  : isResendingOtp
                  ? "Resending..."
                  : "Resend code"}
              </button>
            </p>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-4">
            Remember your password?{" "}
            <Link
              to="/auth/signin"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default ResetPassword;

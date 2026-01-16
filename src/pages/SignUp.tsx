import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ApiError, signUp } from "@/lib/api/auth";
import { emailRegex, nameRegex, passwordRegex, phoneRegex } from "@/lib/regex";
import { motion } from "framer-motion";
import { ArrowLeft, Eye, EyeOff, Lock, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const DIAL_CODES = [
  { code: "+1", country: "US" },
  { code: "+91", country: "IN" },
];

const initialStates = {
  firstName: "",
  lastName: "",
  email: "",
  dialCode: "",
  phoneNumber: "",
  password: "",
  confirmPassword: "",
};

const SignUp = () => {
  // Hooks
  const navigate = useNavigate();
  const { toast } = useToast();

  // States
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState(initialStates);
  const [errors, setErrors] = useState(initialStates);

  // Handlers
  const validateForm = () => {
    const newErrors = { ...initialStates };
    let isValid = true;

    // First Name validation
    const _firstName = formData.firstName.trim();
    if (!_firstName) {
      newErrors.firstName = "First name is required.";
      isValid = false;
    } else if (_firstName.length < 3 || _firstName.length > 20) {
      newErrors.firstName = "First name must be between 3 and 20 characters.";
      isValid = false;
    } else if (!nameRegex.test(_firstName)) {
      newErrors.firstName =
        "First name can contain only letters and a single space (no double spaces).";
      isValid = false;
    }

    // Last Name validation
    const _lastName = formData.lastName.trim();
    if (!_lastName) {
      newErrors.lastName = "Last name is required.";
      isValid = false;
    } else if (_lastName.length < 3 || _lastName.length > 20) {
      newErrors.lastName = "Last name must be between 3 and 20 characters.";
      isValid = false;
    } else if (!nameRegex.test(_lastName)) {
      newErrors.lastName =
        "Last name can contain only letters and a single space (no double spaces).";
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    // Phone validation (optional, but if provided, dialCode is required)
    if (formData.phoneNumber && !formData.dialCode) {
      newErrors.dialCode = "Dial code is required when phone is provided";
      isValid = false;
    }
    if (formData.dialCode && !formData.phoneNumber) {
      newErrors.phoneNumber =
        "Phone number is required when dial code is selected";
      isValid = false;
    }
    if (
      formData.phoneNumber &&
      !phoneRegex.test(formData.phoneNumber.replace(/[^0-9]/g, ""))
    ) {
      newErrors.phoneNumber =
        "Please enter a valid phone number (10-15 digits)";
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      isValid = false;
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password =
        "Password must be 8-24 chars with uppercase, lowercase, number, and special character";
      isValid = false;
    }

    // Confirm Password validation
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
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        ...(formData.dialCode &&
          formData.phoneNumber && {
            dialCode: formData.dialCode,
            phoneNumber: formData.phoneNumber.replace(/[^0-9]/g, ""),
          }),
      };

      const response = await signUp(payload);

      toast({
        title: "Form submitted successfully!",
        description: response.message,
      });

      // Navigate to verify page with session token
      navigate(`/auth/verify?sessionToken=${response.data.sessionToken}`);
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: "Sign up failed",
          description: error.message,
          variant: "destructive",
        });

        // Map API field errors to form errors if available
        if (error.errors) {
          const apiErrors = { ...errors };
          Object.entries(error.errors).forEach(([field, messages]) => {
            if (field in apiErrors) {
              apiErrors[field as keyof typeof apiErrors] = messages[0];
            }
          });
          setErrors(apiErrors);
        }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDialCodeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      dialCode: value === "None" ? "" : value,
    }));
    if (errors.dialCode) {
      setErrors((prev) => ({ ...prev, dialCode: "" }));
    }
  };

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
            {/* <Link to="/" className="inline-block mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                NotifyForYou
              </span>
            </Link> */}
            <h1 className="text-2xl font-bold text-foreground">
              Create an account
            </h1>
            <p className="text-muted-foreground mt-2">
              Start your free trial today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`pl-10 ${
                      errors.firstName ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.firstName && (
                  <p className="text-xs text-destructive">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`pl-10 ${
                      errors.lastName ? "border-destructive" : ""
                    }`}
                  />
                </div>
                {errors.lastName && (
                  <p className="text-xs text-destructive">{errors.lastName}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 ${
                    errors.email ? "border-destructive" : ""
                  }`}
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>
                Phone <span className="text-muted-foreground">(Optional)</span>
              </Label>
              <div className="flex gap-2">
                <div className="w-28">
                  <Select
                    value={formData.dialCode}
                    onValueChange={handleDialCodeChange}
                  >
                    <SelectTrigger
                      className={errors.dialCode ? "border-destructive" : ""}
                    >
                      <SelectValue placeholder="Code" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="None">None</SelectItem>
                      {DIAL_CODES.map((item) => (
                        <SelectItem key={item.code} value={item.code}>
                          {item.code} ({item.country})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="1234567890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className={`pl-10 ${
                      errors.phoneNumber ? "border-destructive" : ""
                    }`}
                  />
                </div>
              </div>
              {(errors.dialCode || errors.phoneNumber) && (
                <p className="text-sm text-destructive">
                  {errors.dialCode || errors.phoneNumber}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
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
              className="w-full mt-2"
              disabled={isLoading}
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-muted-foreground">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </Button>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
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

export default SignUp;

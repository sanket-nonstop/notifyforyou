const BASE_URL_DEV = "http://localhost:5000/api/v1";
const BASE_URL_PROD = "https://notifyforyou-com-server.onrender.com/api/v1";

// ✅ Auto pick base url
const BASE_URL = BASE_URL_PROD; // import.meta.env.MODE === "development" ? BASE_URL_DEV :

// ===================== Types =====================

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  dialCode?: string;
  phoneNumber?: string;
  password: string;
  confirmPassword: string;
}

export interface SignUpResponse {
  success: boolean;
  message: string;
  data: {
    sessionToken: string;
  };
}

export interface ValidateSessionPayload {
  sessionToken: string;
}

export interface ValidateOtpSessionResponse {
  success: boolean;
  message: string;
  data: {
    username?: string;
    email?: string;
    phoneNumber?: string;
  };
}

export interface VerifyOtpPayload {
  sessionToken: string;
  otp: string;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface ResendOtpPayload {
  identifier: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
  data: {
    sessionToken: string;
  };
}

export interface SignInPayload {
  identifier: string;
  password: string;
}

export interface SignInResponse {
  success: boolean;
  message: string;
  data: {
    user: {
      _id: string;
      email: string;
      emailIsVerified: boolean;
      phoneIsVerified: boolean;
      provider: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
    tokens: {
      accessToken: string;
      refreshToken: string;
    };
  };
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  message: string;
  data: {
    newAccessToken: string;
  };
}

export interface ForgotPasswordPayload {
  identifier: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  data: {
    sessionToken: string;
  };
}

export interface ResetPasswordPayload {
  otp: string;
  sessionToken: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
  data: null;
}

export interface ApiErrorResponse {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// ===================== Error Class =====================

class ApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public errors?: Record<string, string[]>
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new ApiError(
      data.message || "An error occurred",
      response.status,
      data.errors
    );
  }

  return data as T;
}

// ===================== ✅ Reusable API Request =====================

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

async function apiRequest<TResponse, TPayload = unknown>(
  endpoint: string,
  method: HttpMethod = "POST",
  payload?: TPayload
): Promise<TResponse> {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: payload ? JSON.stringify(payload) : undefined,
  });

  return handleResponse<TResponse>(response);
}

// ===================== API Functions =====================

export const signUp = (payload: SignUpPayload) =>
  apiRequest<SignUpResponse, SignUpPayload>("/auth/signup", "POST", payload);

export const validateOtpSession = (payload: ValidateSessionPayload) =>
  apiRequest<ValidateOtpSessionResponse, ValidateSessionPayload>(
    "/auth/signup/validate-session",
    "POST",
    payload
  );

export const verifyOtp = (payload: VerifyOtpPayload) =>
  apiRequest<VerifyOtpResponse, VerifyOtpPayload>(
    "/auth/signup/verify-otp",
    "POST",
    payload
  );

export const resendOtp = (payload: ResendOtpPayload) =>
  apiRequest<ResendOtpResponse, ResendOtpPayload>(
    "/auth/signup/resend-verification",
    "POST",
    payload
  );

export const signIn = (payload: SignInPayload) =>
  apiRequest<SignInResponse, SignInPayload>("/auth/signin", "POST", payload);

export const refreshToken = (payload: RefreshTokenPayload) =>
  apiRequest<RefreshTokenResponse, RefreshTokenPayload>(
    "/auth/token/refresh",
    "POST",
    payload
  );

export const forgotPassword = (payload: ForgotPasswordPayload) =>
  apiRequest<ForgotPasswordResponse, ForgotPasswordPayload>(
    "/auth/password/forgot",
    "POST",
    payload
  );

export const validateForgotPasswordOtpSession = (
  payload: ValidateSessionPayload
) =>
  apiRequest<ValidateOtpSessionResponse, ValidateSessionPayload>(
    "/auth/password/forgot/validate-session",
    "POST",
    payload
  );

export const resetPassword = (payload: ResetPasswordPayload) =>
  apiRequest<ResetPasswordResponse, ResetPasswordPayload>(
    "/auth/password/reset",
    "POST",
    payload
  );

export const resendForgotPasswordOtp = (payload: ResendOtpPayload) =>
  apiRequest<ResendOtpResponse, ResendOtpPayload>(
    "/auth/password/forgot/resend-otp",
    "POST",
    payload
  );

export { ApiError };


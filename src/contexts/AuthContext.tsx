import {
  refreshToken as refreshTokenApi,
  SignInResponse,
} from "@/lib/api/auth";
import {
  clearAuthCookies,
  getAccessToken,
  getRefreshToken,
  setAuthCookies,
  updateAccessToken,
} from "@/lib/cookies";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface User {
  _id: string;
  email: string;
  emailIsVerified: boolean;
  phoneIsVerified: boolean;
  provider: string;
  status: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: SignInResponse["data"]) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    clearAuthCookies();
    setUser(null);
  }, []);

  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    const storedRefreshToken = getRefreshToken();

    if (!storedRefreshToken) {
      logout();
      return false;
    }

    try {
      const response = await refreshTokenApi({
        refreshToken: storedRefreshToken,
      });
      updateAccessToken(response.data.newAccessToken);
      return true;
    } catch (error) {
      logout();
      return false;
    }
  }, [logout]);

  const login = useCallback((data: SignInResponse["data"]) => {
    const { user: userData, tokens } = data;
    setAuthCookies(tokens.accessToken, tokens.refreshToken);
    setUser({
      _id: userData._id,
      email: userData.email,
      emailIsVerified: userData.emailIsVerified,
      phoneIsVerified: userData.phoneIsVerified,
      provider: userData.provider,
      status: userData.status,
    });
  }, []);

  // Check auth state on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = getAccessToken();
      const storedRefreshToken = getRefreshToken();

      if (!accessToken && !storedRefreshToken) {
        setIsLoading(false);
        return;
      }

      // If no access token but have refresh token, try to refresh
      if (!accessToken && storedRefreshToken) {
        const success = await refreshAccessToken();
        if (!success) {
          setIsLoading(false);
          return;
        }
      }

      // We have a valid token - user is authenticated
      // Note: In a real app, you might want to fetch user data from an API here
      // For now, we'll just set isAuthenticated based on token presence
      setIsLoading(false);
    };

    checkAuth();
  }, [refreshAccessToken]);

  // Set up token refresh interval
  useEffect(() => {
    // Refresh token 1 minute before expiry (14 minutes)
    const refreshInterval = setInterval(
      async () => {
        const accessToken = getAccessToken();
        const storedRefreshToken = getRefreshToken();

        // Only refresh if we have a refresh token but access token is about to expire
        if (!accessToken && storedRefreshToken) {
          await refreshAccessToken();
        }
      },
      14 * 60 * 1000 // 14 minutes
    );

    return () => clearInterval(refreshInterval);
  }, [refreshAccessToken]);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!(user || getAccessToken() || getRefreshToken()),
    isLoading,
    login,
    logout,
    refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

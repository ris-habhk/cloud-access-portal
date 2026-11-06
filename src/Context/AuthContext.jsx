import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { clearAuth, getCurrentUser, refreshAccessToken, setAuth } from "../authStore.js";
import { API_BASE_URL, apiRequest } from "../services/api.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser);
  const [isLoading, setIsLoading] = useState(true);

  const setSession = useCallback((token, userData) => {
    setAuth(token, userData);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST", skipAuth: true, retry: false });
    } catch (error) {
      console.error("Logout request failed:", error.message);
    } finally {
      clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const handleExpired = () => {
      clearAuth();
      setUser(null);
      setIsLoading(false);
    };

    window.addEventListener("auth:session-expired", handleExpired);

    async function restoreSession() {
      try {
        const token = await refreshAccessToken(API_BASE_URL);
        const result = await apiRequest("/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
          retry: false,
        });
        if (active) {
          setAuth(token, result.data);
          setUser(result.data);
        }
      } catch {
        if (active) {
          clearAuth();
          setUser(null);
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    restoreSession();

    return () => {
      active = false;
      window.removeEventListener("auth:session-expired", handleExpired);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: Boolean(user),
        setSession,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider.");
  return context;
}

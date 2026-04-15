import { createContext, useContext, useState, useCallback } from "react";
import { loginUser as loginAPI, registerUser as registerAPI } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginAPI(credentials);
      const { user: userData, token } = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", token);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await registerAPI(data);
      const { user: userData, token } = response.data;
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("authToken", token);
      setUser(userData);
      return userData;
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    setUser(null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, refreshAPI, logoutAPI } from "../services/authService";
import { setAuthHeader, setupInterceptors } from "../services/axiosInstance";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  // Access token stored in memory only — never localStorage
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // Clear all auth state and redirect to login
  const logout = useCallback(async () => {
    try {
      await logoutAPI();
    } catch (_) {
      // ignore errors on logout
    }
    setAccessToken(null);
    setUser(null);
    setAuthHeader(null);
    navigate("/login");
  }, [navigate]);

  // Setup Axios interceptor once, passing logout as the 401 handler
  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  // On app init — try to restore session via refresh token cookie
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await refreshAPI();
        const { accessToken: token, user: userData } = data.data;
        setAccessToken(token);
        setUser(userData);
        setAuthHeader(token);
      } catch (_) {
        // No valid refresh token — user stays unauthenticated
        setAccessToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => setIsLoading(false), 10000); // 10s timeout
    restoreSession().then(() => clearTimeout(timer));

    return () => clearTimeout(timer);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginAPI(email, password);
    const { accessToken: token, user: userData } = data.data;
    setAccessToken(token);
    setUser(userData);
    setAuthHeader(token);
    return userData;
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// ============================================================
// context/AuthProvider.jsx — Global Authentication State
// ============================================================
// React Context lets us share data across all components
// without passing props manually through every level
//
// What this provides to the whole app:
//   user        → logged-in user info (name, email, role)
//   accessToken → JWT token for API calls
//   isLoading   → true while checking if user is already logged in
//   login()     → call this when user submits login form
//   logout()    → call this when user clicks logout button
// ============================================================

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { loginAPI, refreshAPI, logoutAPI } from "../services/authService";
import { setAuthHeader, setupInterceptors } from "../services/axiosInstance";

// Step 1: Create the context (like a global store)
const AuthContext = createContext(null);

// Step 2: Custom hook — makes it easy to use auth in any component
// Usage: const { user, login, logout } = useAuth();
export const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  // Access token stored in memory (NOT localStorage — safer against XSS)
  const [accessToken, setAccessToken] = useState(null);

  // User info: { id, name, email, role, department, designation }
  const [user, setUser] = useState(null);

  // True while we're checking if user has a valid session on page load
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  // -------------------------------------------------------
  // logout — Clears all auth state and redirects to login
  // useCallback prevents this function from being recreated
  // on every render (important for the interceptor setup)
  // -------------------------------------------------------
  const logout = useCallback(async () => {
    try {
      // Tell the backend to delete the refresh token from DB
      await logoutAPI();
    } catch (_) {
      // Even if API call fails, we still clear local state
    }

    // Clear everything from memory
    setAccessToken(null);
    setUser(null);
    setAuthHeader(null); // Remove Authorization header from Axios

    // Send user back to login page
    navigate("/login");
  }, [navigate]);

  // -------------------------------------------------------
  // Setup Axios interceptor once when app loads
  // The interceptor automatically refreshes the token when
  // any API call returns 401 (token expired)
  // -------------------------------------------------------
  useEffect(() => {
    setupInterceptors(logout);
  }, [logout]);

  // -------------------------------------------------------
  // Restore session on page refresh
  // When user refreshes the page, accessToken in memory is lost
  // We call /api/auth/refresh to get a new one using the cookie
  // -------------------------------------------------------
  useEffect(() => {
    const restoreSession = async () => {
      try {
        // Try to get a new access token using the refresh token cookie
        const { data } = await refreshAPI();
        const { accessToken: token, user: userData } = data.data;

        // Store the new token and user info
        setAccessToken(token);
        setUser(userData);
        setAuthHeader(token); // Set Authorization header for future requests
      } catch (_) {
        // No valid refresh token — user needs to login again
        setAccessToken(null);
        setUser(null);
        setAuthHeader(null); // Clear any stale Authorization header
      } finally {
        // Done checking — hide the loading spinner
        setIsLoading(false);
      }
    };

    // Safety timeout: if refresh takes more than 10 seconds, stop loading
    const timer = setTimeout(() => setIsLoading(false), 10000);
    restoreSession().then(() => clearTimeout(timer));

    return () => clearTimeout(timer);
  }, []);

  // -------------------------------------------------------
  // login — Called when user submits the login form
  // Returns user data so the component can redirect
  // -------------------------------------------------------
  const login = async (email, password) => {
    // Call the login API
    const { data } = await loginAPI(email, password);
    const { accessToken: token, user: userData } = data.data;

    // Save token and user info in memory
    setAccessToken(token);
    setUser(userData);
    setAuthHeader(token); // Attach token to all future Axios requests

    return userData; // Return so Login.jsx can redirect based on role
  };

  // Provide all auth values and functions to child components
  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

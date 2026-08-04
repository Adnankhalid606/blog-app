import { createContext, useEffect, useState } from "react";
import {
  refreshToken,
  getCurrentUser,
  loginUser,
  logoutUser,
} from "../services/authService";
import { setToken } from "../services/tokenService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const checkAuth = async () => {
    try {
      const refreshResponse = await refreshToken();
      setToken(refreshResponse.data.token);
      const userData = await getCurrentUser();
      login(userData.data.user);
    } catch (err) {
      // user is not logged in.
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    checkAuth();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };
  const logout = async () => {
    await logoutUser();
    setToken(null);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

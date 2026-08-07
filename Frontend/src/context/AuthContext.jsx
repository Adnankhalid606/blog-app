import { createContext, useEffect, useState } from "react";
import {
  refreshToken,
  getCurrentUser,
  logoutUser,
} from "../services/authService";
import { setToken } from "../services/tokenService";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    await logoutUser();
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshResponse = await refreshToken();
        setToken(refreshResponse.data.token);
        const userData = await getCurrentUser();
        setUser(userData.data.user);
      } catch {
        // user is not logged in.
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

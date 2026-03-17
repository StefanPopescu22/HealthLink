import { createContext, useEffect, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const saveAuth = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(userData);
  };

  const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  const register = async (formData) => {
    const response = await api.post("/auth/register", formData);
    saveAuth(response.data.token, response.data.user);
    return response.data;
  };

  const login = async (formData) => {
    const response = await api.post("/auth/login", formData);
    saveAuth(response.data.token, response.data.user);
    return response.data;
  };

  const logout = () => {
    clearAuth();
  };

  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const response = await api.get("/auth/me");
        setUser(response.data);

        if (!storedUser) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }
      } catch (error) {
        clearAuth();
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
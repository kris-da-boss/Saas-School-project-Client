import { createContext, useState, useEffect } from "react";
import { loginRequest, logoutRequest, refreshRequest, getMeRequest } from "../api/auth.api";
import { setAccessToken } from "../api/axiosClient";
import { storeRefreshToken, clearStoredRefreshToken } from "../utils/refreshTokenBridge";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we've checked for an existing session

  // On first load, try a silent refresh — if the httpOnly cookie (or the
  // temporary localStorage bridge) is still valid, this logs the user back
  // in without them re-entering a password.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await refreshRequest();
        setAccessToken(data.data.accessToken);
        if (data.data.refreshToken) storeRefreshToken(data.data.refreshToken);
        const me = await getMeRequest();
        setUser(me.data.data);
      } catch {
        setAccessToken(null);
        clearStoredRefreshToken();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ schoolCode, email, password }) => {
    const { data } = await loginRequest({ schoolCode, email, password });
    setAccessToken(data.data.accessToken);
    storeRefreshToken(data.data.refreshToken);
    setUser(data.data.user);
    return data.data.user;
  };

  const logout = async () => {
    await logoutRequest();
    setAccessToken(null);
    clearStoredRefreshToken();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useState, useEffect, useRef } from "react";
import { loginRequest, logoutRequest, refreshRequest, getMeRequest } from "../api/auth.api";
import { setAccessToken } from "../api/axiosClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we've checked for an existing session

  // If the person manually logs in WHILE the background check below is
  // still in flight (e.g. it's slow because the server is cold-starting),
  // that background check must not be allowed to overwrite the fresh,
  // successful login when it eventually resolves - that race is exactly
  // what caused "stuck on Loading... forever after logging in".
  const manualLoginHappened = useRef(false);

  // On first load, try a silent refresh — if the httpOnly cookie is still
  // valid, this logs the user back in without them re-entering a password.
  useEffect(() => {
    (async () => {
      try {
        const { data } = await refreshRequest();
        if (manualLoginHappened.current) return; // a manual login already won the race
        setAccessToken(data.data.accessToken);
        const me = await getMeRequest();
        if (manualLoginHappened.current) return;
        setUser(me.data.data);
      } catch {
        if (!manualLoginHappened.current) {
          setAccessToken(null);
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async ({ schoolCode, email, password }) => {
    const { data } = await loginRequest({ schoolCode, email, password });
    manualLoginHappened.current = true;
    setAccessToken(data.data.accessToken);
    setUser(data.data.user);
    // Explicitly unblock ProtectedRoute here rather than waiting for the
    // background check above to finish on its own - a successful manual
    // login is definitive, it should never be stuck waiting on anything else.
    setLoading(false);
    return data.data.user;
  };

  const logout = async () => {
    await logoutRequest();
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

import { createContext, useState, useEffect, useRef } from "react";
import { loginRequest, logoutRequest, refreshRequest, getMeRequest } from "../api/auth.api";
import { setAccessToken, getAccessToken } from "../api/axiosClient";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we've checked for an existing session

  // If the person manually logs in WHILE the background check below is
  // still in flight, that background check must not be allowed to
  // overwrite the fresh, successful login when it eventually resolves.
  const manualLoginHappened = useRef(false);

  useEffect(() => {
    (async () => {
      try {
        const existingToken = getAccessToken();

        if (existingToken) {
          // Fast path: we already have a token, restored from
          // sessionStorage in THIS tab. Just confirm it's still valid -
          // no dependency on the cross-domain refresh cookie at all, which
          // is what makes this work even when that cookie is blocked.
          const me = await getMeRequest();
          if (!manualLoginHappened.current) setUser(me.data.data);
          return;
        }

        // No stored token (a brand new tab, or sessionStorage was cleared)
        // - fall back to the refresh cookie. This still works whenever the
        // browser actually allows the cookie through.
        const { data } = await refreshRequest();
        if (manualLoginHappened.current) return;
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

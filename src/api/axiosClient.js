import axios from "axios";

// All backend calls go through this instance. Import it, never raw axios.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://your-render-url.onrender.com/api/v1
  withCredentials: true, // sends the httpOnly refreshToken cookie automatically
  // Without this, a genuinely hung request (cold server, dead connection)
  // waits forever with no feedback. 30s is generous enough for a Render
  // free-tier cold start while still eventually failing cleanly.
  timeout: 30000,
});

// In-memory access token. Deliberately NOT localStorage/sessionStorage —
// keeping it in memory means a stolen XSS payload can't read it from storage,
// and it naturally clears on tab close (the refresh cookie handles persistence).
let accessToken = null;

export const setAccessToken = (token) => {
  accessToken = token;
};

axiosClient.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// If a request fails with 401 (expired access token), try ONE silent refresh,
// then retry the original request. If refresh also fails, give up (user must
// log in again) — the `_retry` flag stops THAT request from looping forever.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // CRITICAL: if the request that just failed with 401 was ITSELF the
    // refresh call, do NOT try to "refresh" again in response - that's
    // circular. A 401 on /auth/refresh legitimately means "no valid
    // session, log in again", not "try refreshing harder". Without this
    // check, a fresh page load with no valid session cookie would 401 on
    // refresh, trigger another refresh attempt, which 401s again, forever -
    // exactly the "stuck loading no matter how long I wait" symptom, since
    // it's not one request hanging but an endless chain of fast failures
    // that never lets the original calling code's promise settle.
    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !originalRequest._retry && !isRefreshCall) {
      originalRequest._retry = true;
      try {
        const { data } = await axiosClient.post("/auth/refresh");
        setAccessToken(data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return axiosClient(originalRequest);
      } catch (refreshError) {
        setAccessToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;

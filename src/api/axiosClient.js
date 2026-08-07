import axios from "axios";

// All backend calls go through this instance. Import it, never raw axios.
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // e.g. https://your-render-url.onrender.com/api/v1
  withCredentials: true, // sends the httpOnly refreshToken cookie automatically
  // Without this, a hung backend (crashed process, stuck DB connection,
  // Render free-tier cold start gone wrong) spins the UI forever with zero
  // feedback. 30s comfortably covers a normal cold start while still
  // failing fast enough to show an actual error instead of an endless spinner.
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
// log in again) — the `_retry` flag stops this from looping forever.
axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
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

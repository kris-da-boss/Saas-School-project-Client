import axios from "axios";

// Requests now go through Vercel's own domain, which proxies /api/* to the
// Render backend (see vercel.json). This makes the frontend and API
// same-origin from the browser's point of view, so the refresh cookie is
// first-party — no more Safari/mobile third-party cookie blocking.
const axiosClient = axios.create({
  baseURL: "/api/v1",
  withCredentials: true, // sends the httpOnly refreshToken cookie automatically
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

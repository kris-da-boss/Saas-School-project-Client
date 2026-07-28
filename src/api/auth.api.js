import axiosClient from "./axiosClient";
import { getStoredRefreshToken } from "../utils/refreshTokenBridge";

export const loginRequest = (payload) => axiosClient.post("/auth/login", payload);
export const logoutRequest = () => axiosClient.post("/auth/logout");
export const refreshRequest = () =>
  axiosClient.post("/auth/refresh", { refreshToken: getStoredRefreshToken() });
export const getMeRequest = () => axiosClient.get("/auth/me");
export const getSchoolBySubdomain = (subdomain) =>
  axiosClient.get(`/schools/by-subdomain/${subdomain}`);

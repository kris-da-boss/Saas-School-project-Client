import axiosClient from "./axiosClient";

export const loginRequest = (payload) => axiosClient.post("/auth/login", payload);
export const logoutRequest = () => axiosClient.post("/auth/logout");
export const refreshRequest = () => axiosClient.post("/auth/refresh");
export const getMeRequest = () => axiosClient.get("/auth/me");
export const getSchoolBySubdomain = (subdomain) =>
  axiosClient.get(`/schools/by-subdomain/${subdomain}`);

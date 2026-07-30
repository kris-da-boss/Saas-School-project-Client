import axiosClient from "./axiosClient";

export const getClasses = (params) => axiosClient.get("/classes", { params });
export const getClassById = (id) => axiosClient.get(`/classes/${id}`);
export const createClass = (payload) => axiosClient.post("/classes", payload);
export const updateClass = (id, payload) => axiosClient.patch(`/classes/${id}`, payload);
export const deactivateClass = (id) => axiosClient.delete(`/classes/${id}`);

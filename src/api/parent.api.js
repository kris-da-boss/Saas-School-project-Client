import axiosClient from "./axiosClient";

export const getParents = (params) => axiosClient.get("/parents", { params });
export const getParentById = (id) => axiosClient.get(`/parents/${id}`);

export const createParent = (formData) =>
  axiosClient.post("/parents", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateParent = (id, formData) =>
  axiosClient.patch(`/parents/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deactivateParent = (id) => axiosClient.delete(`/parents/${id}`);

import axiosClient from "./axiosClient";

export const getSubjects = (params) => axiosClient.get("/subjects", { params });
export const getSubjectById = (id) => axiosClient.get(`/subjects/${id}`);
export const createSubject = (payload) => axiosClient.post("/subjects", payload);
export const updateSubject = (id, payload) => axiosClient.patch(`/subjects/${id}`, payload);
export const deactivateSubject = (id) => axiosClient.delete(`/subjects/${id}`);

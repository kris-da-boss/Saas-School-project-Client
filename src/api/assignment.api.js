import axiosClient from "./axiosClient";

export const getAssignments = (params) => axiosClient.get("/assignments", { params });
export const getAssignmentById = (id) => axiosClient.get(`/assignments/${id}`);
export const createAssignment = (payload) => axiosClient.post("/assignments", payload);
export const updateAssignment = (id, payload) => axiosClient.patch(`/assignments/${id}`, payload);
export const deactivateAssignment = (id) => axiosClient.delete(`/assignments/${id}`);
export const getAssignmentRoster = (id) => axiosClient.get(`/assignments/${id}/roster`);
export const gradeSubmission = (id, payload) => axiosClient.patch(`/assignments/${id}/grade`, payload);

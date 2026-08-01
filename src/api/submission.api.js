import axiosClient from "./axiosClient";

export const getMyAssignments = () => axiosClient.get("/submissions/mine");

export const submitAssignment = (assignmentId, formData) =>
  axiosClient.post(`/submissions/${assignmentId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

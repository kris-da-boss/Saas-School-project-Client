import axiosClient from "./axiosClient";

export const getStudents = (params) => axiosClient.get("/students", { params });
export const getStudentById = (id) => axiosClient.get(`/students/${id}`);

// FormData is required here because these two calls may include a photo file
export const createStudent = (formData) =>
  axiosClient.post("/students", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateStudent = (id, formData) =>
  axiosClient.patch(`/students/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deactivateStudent = (id) => axiosClient.delete(`/students/${id}`);

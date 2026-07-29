import axiosClient from "./axiosClient";

export const getTeachers = (params) => axiosClient.get("/teachers", { params });
export const getTeacherById = (id) => axiosClient.get(`/teachers/${id}`);

export const createTeacher = (formData) =>
  axiosClient.post("/teachers", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateTeacher = (id, formData) =>
  axiosClient.patch(`/teachers/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deactivateTeacher = (id) => axiosClient.delete(`/teachers/${id}`);

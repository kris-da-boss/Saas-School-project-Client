import axiosClient from "./axiosClient";

export const getExams = (params) => axiosClient.get("/exams", { params });
export const getExamById = (id) => axiosClient.get(`/exams/${id}`);
export const createExam = (payload) => axiosClient.post("/exams", payload);
export const bulkCreateExams = (payload) => axiosClient.post("/exams/bulk", payload);
export const deactivateExam = (id) => axiosClient.delete(`/exams/${id}`);
export const getExamRoster = (examId) => axiosClient.get(`/exams/${examId}/roster`);
export const submitResults = (examId, payload) => axiosClient.post(`/exams/${examId}/results`, payload);

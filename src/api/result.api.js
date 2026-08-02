import axiosClient from "./axiosClient";

export const getReportCard = (studentId, term, session) =>
  axiosClient.get(`/results/report-card/${studentId}`, { params: { term, session } });

// Returns the raw PDF blob so the caller can trigger a download
export const downloadReportCardPdf = (studentId, term, session) =>
  axiosClient.get(`/results/report-card/${studentId}/pdf`, {
    params: { term, session },
    responseType: "blob",
  });

// Student-facing: resolves their own StudentProfile server-side, no id needed
export const getMyReportCard = (term, session) =>
  axiosClient.get("/results/report-card/mine/view", { params: { term, session } });

export const downloadMyReportCardPdf = (term, session) =>
  axiosClient.get("/results/report-card/mine/pdf", {
    params: { term, session },
    responseType: "blob",
  });

import axiosClient from "./axiosClient";

export const getAdminOverview = () => axiosClient.get("/dashboard/admin");
export const getTeacherOverview = () => axiosClient.get("/dashboard/teacher");
export const getStudentOverview = () => axiosClient.get("/dashboard/student");
export const getParentOverview = (childId) =>
  axiosClient.get("/dashboard/parent", { params: childId ? { childId } : {} });

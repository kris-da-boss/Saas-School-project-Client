import axiosClient from "./axiosClient";

export const getAttendanceForDate = (classId, date) =>
  axiosClient.get(`/attendance/class/${classId}`, { params: { date } });

export const markAttendance = (classId, payload) =>
  axiosClient.post(`/attendance/class/${classId}`, payload);

export const getAttendanceDates = (classId) => axiosClient.get(`/attendance/class/${classId}/dates`);

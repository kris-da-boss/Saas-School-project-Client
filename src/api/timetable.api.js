import axiosClient from "./axiosClient";

export const getTimetableForClass = (classId) => axiosClient.get(`/timetables/class/${classId}`);
export const getMyTimetable = () => axiosClient.get("/timetables/mine");

export const addTimetableEntry = (classId, payload) =>
  axiosClient.post(`/timetables/class/${classId}/entries`, payload);

export const updateTimetableEntry = (classId, entryId, payload) =>
  axiosClient.patch(`/timetables/class/${classId}/entries/${entryId}`, payload);

export const deleteTimetableEntry = (classId, entryId) =>
  axiosClient.delete(`/timetables/class/${classId}/entries/${entryId}`);

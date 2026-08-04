import axiosClient from "./axiosClient";

// Management (admin/teacher)
export const getAnnouncements = (params) => axiosClient.get("/announcements", { params });
export const createAnnouncement = (payload) => axiosClient.post("/announcements", payload);
export const deactivateAnnouncement = (id) => axiosClient.delete(`/announcements/${id}`);

// Every role's own inbox
export const getMyAnnouncements = () => axiosClient.get("/announcements/mine");
export const getUnreadCount = () => axiosClient.get("/announcements/mine/unread-count");
export const markAsRead = (notificationId) =>
  axiosClient.patch(`/announcements/mine/${notificationId}/read`);
export const markAllRead = () => axiosClient.patch("/announcements/mine/read-all");

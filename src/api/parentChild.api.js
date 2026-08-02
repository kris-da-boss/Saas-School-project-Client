import axiosClient from "./axiosClient";

export const getMyChildren = () => axiosClient.get("/parents/mine");

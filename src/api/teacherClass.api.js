import axiosClient from "./axiosClient";

export const getMyClasses = () => axiosClient.get("/classes/mine");

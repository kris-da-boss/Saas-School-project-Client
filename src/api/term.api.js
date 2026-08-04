import axiosClient from "./axiosClient";

export const getTerm = (term, session) => axiosClient.get("/terms", { params: { term, session } });
export const upsertTerm = (payload) => axiosClient.put("/terms", payload);

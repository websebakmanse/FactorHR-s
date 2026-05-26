import axiosInstance from "./axiosInstance";

export const loginAPI = (email, password) =>
  axiosInstance.post("/auth/login", { email, password });

export const refreshAPI = () =>
  axiosInstance.post("/auth/refresh");

export const logoutAPI = () =>
  axiosInstance.post("/auth/logout");

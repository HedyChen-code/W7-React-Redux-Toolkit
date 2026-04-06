import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE;
export const API_PATH = import.meta.env.VITE_API_PATH;

// 前台
export const api = axios.create({
  baseURL: API_BASE,
});

// 後台
export const adminApi = axios.create({
  baseURL: API_BASE,
});

adminApi.interceptors.request.use(
  (config) => {
    const token = document.cookie
      .split(";")
      .find((row) => row.startsWith("jiaToken="))
      ?.split("=")[1];
    
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
)
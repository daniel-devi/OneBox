import axios from "axios";
import { ACCESS_TOKEN } from "./constants";

export const authToken = localStorage.getItem(ACCESS_TOKEN);

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Check if the request is of type 'multipart/form-data' before setting the header
    if (config.headers["Content-Type"] === "multipart/form-data") {
      config.headers["Content-Type"] = "multipart/form-data";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;

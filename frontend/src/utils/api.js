// utils/api.js
import axios from "axios";

const API = axios.create({
  // Use VITE_API_URL set in Vercel; if not set, default to localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;

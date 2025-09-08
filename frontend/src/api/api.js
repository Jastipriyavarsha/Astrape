import axios from "axios";

const baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
const API = axios.create({ baseURL });

// Add token to request if exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;

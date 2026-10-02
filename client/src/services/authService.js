import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://tasktrack-qovl.onrender.com";

const api = axios.create({
  withCredentials: true,
});

export const registerUser = (userData) =>
  api.post(`${API_URL}/auth/register`, userData);

export const loginUser = (userData) =>
  api.post(`${API_URL}/auth/login`, userData);

export const logoutUser = () =>
  api.post(`${API_URL}/auth/logout`);

export const getCurrentUser = () =>
  api.get(`${API_URL}/auth/me`);
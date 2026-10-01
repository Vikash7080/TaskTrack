import axios from "axios";

const API_URL = "https://tasktrack-qovl.onrender.com/auth";

const api = axios.create({
  withCredentials: true,
});

export const registerUser = (userData) =>
  api.post(`${API_URL}/register`, userData);

export const loginUser = (userData) =>
  api.post(`${API_URL}/login`, userData);

export const logoutUser = () =>
  api.post(`${API_URL}/logout`);

export const getCurrentUser = () =>
  api.get(`${API_URL}/me`);
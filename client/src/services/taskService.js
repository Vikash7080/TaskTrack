import axios from "axios";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://tasktrack-qovl.onrender.com";

const api = axios.create({
  withCredentials: true,
});

export const getTasks = () =>
  api.get(`${API_URL}/tasks`);

export const createTask = (task) =>
  api.post(`${API_URL}/tasks`, task);

export const updateTask = (id, task) =>
  api.put(`${API_URL}/tasks/${id}`, task);

export const toggleTask = (id) =>
  api.patch(`${API_URL}/tasks/${id}/toggle`);

export const deleteTask = (id) =>
  api.delete(`${API_URL}/tasks/${id}`);

export const toggleImportant = (id) =>
  api.patch(`${API_URL}/tasks/${id}/important`);

export const reorderTasks = (tasks) =>
  api.put(`${API_URL}/tasks/reorder`, { tasks });
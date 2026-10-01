import axios from "axios";
const API_URL = "https://tasktrack-qovl.onrender.com/tasks";

const api = axios.create({
  withCredentials: true,
});

export const getTasks = () => api.get(API_URL);

export const createTask = (task) =>
  api.post(API_URL, task);

export const updateTask = (id, task) =>
  api.put(`${API_URL}/${id}`, task);

export const toggleTask = (id) =>
  api.patch(`${API_URL}/${id}/toggle`);

export const deleteTask = (id) =>
  api.delete(`${API_URL}/${id}`);

export const toggleImportant = (id) =>
  api.patch(`${API_URL}/${id}/important`);

export const reorderTasks = (tasks) =>
  api.put(`${API_URL}/reorder`, { tasks });
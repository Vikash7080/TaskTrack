import axios from "axios";

const API_URL = "https://tasktrack-qovl.onrender.com/tasks";

export const getTasks = () => axios.get(API_URL);

export const createTask = (task) =>
  axios.post(API_URL, task);

export const updateTask = (id, task) =>
  axios.put(`${API_URL}/${id}`, task);

export const toggleTask = (id) =>
  axios.patch(`${API_URL}/${id}/toggle`);

export const deleteTask = (id) =>
  axios.delete(`${API_URL}/${id}`);
export const toggleImportant = (id) =>
  axios.patch(`${API_URL}/${id}/important`);
export const reorderTasks = (tasks) =>
  axios.put(
    `${API_URL}/reorder`,
    { tasks }
  );
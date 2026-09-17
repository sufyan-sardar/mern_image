import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
});

export const getImages = () => api.get("/images");

export const getImage = (id) => api.get(`/images/${id}`);

export const createImage = (formData) =>
  api.post("/images", formData);

export const updateImage = (id, formData) =>
  api.put(`/images/${id}`, formData);

export const deleteImage = (id) => api.delete(`/images/${id}`);

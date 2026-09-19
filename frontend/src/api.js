import axios from "axios";

export const BASE_URL ="https://mernimage-production.up.railway.app/api/images";

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

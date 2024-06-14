import axios from 'axios';

const API = axios.create({ baseURL: "https://social-media-yf7p.onrender.com" });

export const createReview = (id, data) => API.post(`/post/${id}/reviews`, data);
export const getAllReviews = (id) => API.get(`/post/${id}/reviews`);
export const updateReview = (id, reviewId, data) => API.put(`/post/${id}/reviews/${reviewId}`, data);
export const deleteReview = (id, reviewId, data) => API.delete(`/post/${id}/reviews/${reviewId}`, { data: data });
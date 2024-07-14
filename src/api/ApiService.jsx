import axios from 'axios';

const API_BASE_URL = 'http://3.93.152.145/';

export const ApiService = {
  get: (endpoint) => axios.get(`${API_BASE_URL}${endpoint}`),
  post: (endpoint, data) => axios.post(`${API_BASE_URL}${endpoint}`, data),
  put: (endpoint, data) => axios.put(`${API_BASE_URL}${endpoint}`, data),
  delete: (endpoint) => axios.delete(`${API_BASE_URL}${endpoint}`),
};
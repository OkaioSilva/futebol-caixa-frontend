import axios from 'axios';

const api = axios.create({
  baseURL:'https://futebol-caixa-backend.onrender.com',
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  config.headers = {
    ...config.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
  return config;
}, error => {
  return Promise.reject(error);
});

export default api;
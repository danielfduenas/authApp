import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5242/api', // El puerto de tu Web API en .NET
});

// Interceptor para inyectar automáticamente el token JWT en las cabeceras
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Requisito de cabecera 
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;
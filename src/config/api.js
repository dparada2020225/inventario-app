// Crear un nuevo archivo src/config/api.js

const API_URL = "https://inventario-server.vercel.app";

export default API_URL;

// Actualiza src/services/api.js (primera parte)

import axios from 'axios';
import API_URL from '../config/api';

// Interceptor para añadir el token a todas las solicitudes
axios.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejo de errores
axios.interceptors.response.use(
  response => response,
  error => {
    // Registrar errores para depuración
    console.error('Error en solicitud API:', error);
    
    if (error.response) {
      console.error('Respuesta de error:', error.response.data);
      console.error('Código de estado:', error.response.status);
      
      // Manejar token expirado o inválido (401)
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        // Opcional: redirigir a login si es un error de autenticación
        // window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
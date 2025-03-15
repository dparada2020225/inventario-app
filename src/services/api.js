// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://inventario-server.vercel.app';

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

export const productService = {
  // Obtener todos los productos
  getAllProducts: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products`);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },
  
  // Crear un nuevo producto
  createProduct: async (productData) => {
    try {
      const response = await axios.post(`${API_URL}/api/products`, productData);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  },
  
  // Actualizar un producto existente
  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_URL}/api/products/${id}`, productData);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  },
  
  // Eliminar un producto
  deleteProduct: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`);
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  },
  
  // Exportar a CSV
  exportToCSV: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/products/export-csv`, {
        responseType: 'blob'
      });
      
      // Crear un enlace para descargar el archivo
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'productos.csv');
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      return true;
    } catch (error) {
      console.error('Error exporting to CSV:', error);
      throw error;
    }
  },
  
  // Subir imagen
  uploadImage: async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },
  
  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
  
  // Obtener información del usuario actual
  getCurrentUser: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/me`);
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },
  
  // Obtener todos los usuarios (solo para admin)
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_URL}/api/auth/users`);
      return response.data;
    } catch (error) {
      console.error('Error getting all users:', error);
      throw error;
    }
  },
  
  // Cerrar sesión
  logout: () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default productService;
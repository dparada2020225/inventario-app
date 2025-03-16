// src/services/api.js
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
      console.log('Obteniendo todos los productos...');
      const response = await axios.get(`${API_URL}/api/products`);
      console.log('Productos obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Crear un nuevo producto
  createProduct: async (productData) => {
    try {
      console.log('Creando nuevo producto con datos:', productData);
      const response = await axios.post(`${API_URL}/api/products`, productData);
      console.log('Producto creado con éxito:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating product:', error);
      console.log('Respuesta de error:', error.response?.data);
      throw error;
    }
  },
  
  // Actualizar un producto existente
  updateProduct: async (id, productData) => {
    try {
      console.log(`Actualizando producto ${id} con datos:`, productData);
      const response = await axios.put(`${API_URL}/api/products/${id}`, productData);
      console.log('Producto actualizado con éxito:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      console.log('Respuesta de error:', error.response?.data);
      throw error;
    }
  },
  
  // Eliminar un producto
  deleteProduct: async (id) => {
    try {
      console.log(`Eliminando producto con ID: ${id}`);
      await axios.delete(`${API_URL}/api/products/${id}`);
      console.log('Producto eliminado con éxito');
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      console.log('Respuesta de error:', error.response?.data);
      throw error;
    }
  },
  
  // Subir imagen
  uploadImage: async (file) => {
    try {
      console.log('Subiendo imagen:', file.name);
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      console.log('Imagen subida correctamente:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error uploading image:', error);
      console.log('Respuesta de error:', error.response?.data);
      throw error;
    }
  }
};

// Servicios para compras
export const purchaseService = {
  // Obtener todas las compras con opción de filtrado por fecha
  getAllPurchases: async (params = {}) => {
    try {
      console.log('Obteniendo compras con parámetros:', params);
      
      // Construir la URL con los parámetros de consulta
      let url = `${API_URL}/api/purchases`;
      
      // Si hay parámetros de fecha, agregar como query string
      if (params.startDate && params.endDate) {
        const queryParams = new URLSearchParams({
          startDate: params.startDate,
          endDate: params.endDate
        }).toString();
        
        url = `${url}?${queryParams}`;
      }
      
      const response = await axios.get(url);
      console.log('Compras obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchases:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Obtener una compra por ID
  getPurchaseById: async (id) => {
    try {
      console.log(`Obteniendo compra con ID: ${id}`);
      const response = await axios.get(`${API_URL}/api/purchases/${id}`);
      console.log('Compra obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching purchase:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Crear una nueva compra
  createPurchase: async (purchaseData) => {
    try {
      console.log('Creando nueva compra con datos:', purchaseData);
      const response = await axios.post(`${API_URL}/api/purchases`, purchaseData);
      console.log('Compra creada con éxito:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating purchase:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  }
};

// Servicios para ventas
export const saleService = {
  // Obtener todas las ventas con opción de filtrado por fecha
  getAllSales: async (params = {}) => {
    try {
      console.log('Obteniendo ventas con parámetros:', params);
      
      // Construir la URL con los parámetros de consulta
      let url = `${API_URL}/api/sales`;
      
      // Si hay parámetros de fecha, agregar como query string
      if (params.startDate && params.endDate) {
        const queryParams = new URLSearchParams({
          startDate: params.startDate,
          endDate: params.endDate
        }).toString();
        
        url = `${url}?${queryParams}`;
      }
      
      const response = await axios.get(url);
      console.log('Ventas obtenidas:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error fetching sales:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Obtener una venta por ID
  getSaleById: async (id) => {
    try {
      console.log(`Obteniendo venta con ID: ${id}`);
      const response = await axios.get(`${API_URL}/api/sales/${id}`);
      console.log('Venta obtenida:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching sale:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Crear una nueva venta
  createSale: async (saleData) => {
    try {
      console.log('Creando nueva venta con datos:', saleData);
      const response = await axios.post(`${API_URL}/api/sales`, saleData);
      console.log('Venta creada con éxito:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating sale:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  }
};

// Servicio de autenticación
export const authService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      console.log('Iniciando sesión...');
      const response = await axios.post(`${API_URL}/api/auth/login`, credentials);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      }
      console.log('Sesión iniciada con éxito');
      return response.data;
    } catch (error) {
      console.error('Error logging in:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Registrar usuario
  register: async (userData) => {
    try {
      console.log('Registrando nuevo usuario:', userData.username);
      const response = await axios.post(`${API_URL}/api/auth/register`, userData);
      console.log('Usuario registrado con éxito');
      return response.data;
    } catch (error) {
      console.error('Error registering user:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Obtener información del usuario actual
  getCurrentUser: async () => {
    try {
      console.log('Obteniendo información del usuario actual...');
      const response = await axios.get(`${API_URL}/api/auth/me`);
      console.log('Información de usuario obtenida');
      return response.data;
    } catch (error) {
      console.error('Error getting current user:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Obtener todos los usuarios (solo para admin)
  getAllUsers: async () => {
    try {
      console.log('Obteniendo todos los usuarios...');
      const response = await axios.get(`${API_URL}/api/auth/users`);
      console.log('Usuarios obtenidos:', response.data.length);
      return response.data;
    } catch (error) {
      console.error('Error getting all users:', error);
      console.log('Detalles del error:', error.response?.data);
      throw error;
    }
  },
  
  // Cerrar sesión
  logout: () => {
    console.log('Cerrando sesión...');
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    console.log('Sesión cerrada');
  }
};

export default productService;
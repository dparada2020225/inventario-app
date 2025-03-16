// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Configurar el token en los headers por defecto
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [token]);

  // Verificar token al cargar el componente
  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        console.log("Verificando token...");
        const res = await axios.get(`${API_URL}/api/auth/me`);
        console.log("Respuesta de verificación de token:", res.data);
        setUser(res.data);
        setError(null);
      } catch (err) {
        console.error('Error verificando token:', err);
        // Mostrar detalles específicos del error para depuración
        if (err.response) {
          console.error('Respuesta del servidor:', err.response.data);
          console.error('Código de estado:', err.response.status);
        } else if (err.request) {
          console.error('No se recibió respuesta del servidor:', err.request);
        } else {
          console.error('Error en la configuración de la solicitud:', err.message);
        }
        
        setToken(null);
        setUser(null);
        setError('Sesión expirada. Por favor inicia sesión nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    verifyToken();
  }, [token, API_URL]);

  // Iniciar sesión
  const login = async (username, password) => {
    try {
      setLoading(true);
      console.log("Iniciando sesión con:", { username });
      const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      console.log("Respuesta de login:", res.data);
      setToken(res.data.token);
      setUser(res.data.user);
      setError(null);
      return true;
    } catch (err) {
      console.error('Error en login:', err);
      if (err.response) {
        console.error('Respuesta del servidor:', err.response.data);
        setError(err.response.data.message || 'Error al iniciar sesión');
      } else {
        setError('Error de conexión al servidor');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Registrar usuario (solo admin puede crear)
  const register = async (userData) => {
    try {
      setLoading(true);
      console.log("Registrando usuario:", userData.username);
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      console.log("Respuesta de registro:", res.data);
      setError(null);
      return res.data;
    } catch (err) {
      console.error('Error en registro:', err);
      if (err.response) {
        console.error('Respuesta del servidor:', err.response.data);
        setError(err.response.data.message || 'Error al registrar usuario');
      } else {
        setError('Error de conexión al servidor');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const logout = () => {
    setToken(null);
    setUser(null);
    navigate('/login');
  };

  // Obtener todos los usuarios (solo admin) - usando useCallback para memorizar la función
  const getAllUsers = useCallback(async () => {
    try {
      setLoading(true);
      
      // Solo iniciar el log una vez para no llenar la consola
      console.log("Solicitando lista de usuarios...");
      
      // Usar el token desde el state para mayor seguridad
      const res = await axios.get(`${API_URL}/api/auth/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        // Añadir timestamp para evitar cacheo del navegador
        params: {
          _t: new Date().getTime()
        }
      });
      
      return res.data;
    } catch (err) {
      console.error('Error al obtener usuarios:', err);
      
      // Información detallada del error para depuración
      if (err.response) {
        console.error('Respuesta del servidor:', err.response.data);
        console.error('Código de estado:', err.response.status);
        setError(err.response.data.message || 'Error al obtener usuarios');
      } else if (err.request) {
        console.error('No se recibió respuesta:', err.request);
        setError('Error de red: No se pudo conectar con el servidor');
      } else {
        console.error('Error en la configuración:', err.message);
        setError(`Error: ${err.message}`);
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  }, [API_URL, token]); // Dependencias mínimas para useCallback

  return (
    <AuthContext.Provider value={{
      user,
      token,
      loading,
      error,
      login,
      logout,
      register,
      getAllUsers,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin'
    }}>
      {children}
    </AuthContext.Provider>
  );
};
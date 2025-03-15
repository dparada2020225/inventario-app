// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
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
        const res = await axios.get(`${API_URL}/api/auth/me`);
        setUser(res.data);
        setError(null);
      } catch (err) {
        console.error('Error verifying token:', err);
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
      const res = await axios.post(`${API_URL}/api/auth/login`, { username, password });
      setToken(res.data.token);
      setUser(res.data.user);
      setError(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al iniciar sesión');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Registrar usuario (solo admin puede crear)
  const register = async (userData) => {
    try {
      setLoading(true);
      const res = await axios.post(`${API_URL}/api/auth/register`, userData);
      setError(null);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar usuario');
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

  // Obtener todos los usuarios (solo admin)
  const getAllUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/auth/users`);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener usuarios');
      throw err;
    } finally {
      setLoading(false);
    }
  };

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
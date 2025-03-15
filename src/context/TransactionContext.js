// src/context/TransactionContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { purchaseService, saleService } from '../services/api';

const TransactionContext = createContext();

export const useTransactions = () => useContext(TransactionContext);

export const TransactionProvider = ({ children }) => {
  // Estado para compras
  const [purchases, setPurchases] = useState([]);
  const [purchasesLoading, setPurchasesLoading] = useState(false);
  const [purchasesError, setPurchasesError] = useState(null);
  
  // Estado para ventas
  const [sales, setSales] = useState([]);
  const [salesLoading, setSalesLoading] = useState(false);
  const [salesError, setSalesError] = useState(null);
  
  // Cargar compras
  const fetchPurchases = async () => {
    try {
      setPurchasesLoading(true);
      setPurchasesError(null);
      const data = await purchaseService.getAllPurchases();
      setPurchases(data);
    } catch (error) {
      console.error('Error al cargar compras:', error);
      setPurchasesError('Error al cargar el historial de compras');
    } finally {
      setPurchasesLoading(false);
    }
  };
  
  // Cargar ventas
  const fetchSales = async () => {
    try {
      setSalesLoading(true);
      setSalesError(null);
      const data = await saleService.getAllSales();
      setSales(data);
    } catch (error) {
      console.error('Error al cargar ventas:', error);
      setSalesError('Error al cargar el historial de ventas');
    } finally {
      setSalesLoading(false);
    }
  };
  
  // Crear nueva compra
  const createPurchase = async (purchaseData) => {
    try {
      setPurchasesLoading(true);
      setPurchasesError(null);
      const result = await purchaseService.createPurchase(purchaseData);
      setPurchases([...purchases, result]);
      return result;
    } catch (error) {
      console.error('Error al crear compra:', error);
      setPurchasesError('Error al registrar la compra');
      throw error;
    } finally {
      setPurchasesLoading(false);
    }
  };
  
  // Crear nueva venta
  const createSale = async (saleData) => {
    try {
      setSalesLoading(true);
      setSalesError(null);
      const result = await saleService.createSale(saleData);
      setSales([...sales, result]);
      return result;
    } catch (error) {
      console.error('Error al crear venta:', error);
      setSalesError('Error al registrar la venta');
      throw error;
    } finally {
      setSalesLoading(false);
    }
  };
  
  // Obtener información de una compra específica
  const getPurchase = async (id) => {
    try {
      setPurchasesLoading(true);
      setPurchasesError(null);
      return await purchaseService.getPurchaseById(id);
    } catch (error) {
      console.error('Error al obtener detalle de compra:', error);
      setPurchasesError('Error al obtener información de la compra');
      throw error;
    } finally {
      setPurchasesLoading(false);
    }
  };
  
  // Obtener información de una venta específica
  const getSale = async (id) => {
    try {
      setSalesLoading(true);
      setSalesError(null);
      return await saleService.getSaleById(id);
    } catch (error) {
      console.error('Error al obtener detalle de venta:', error);
      setSalesError('Error al obtener información de la venta');
      throw error;
    } finally {
      setSalesLoading(false);
    }
  };
  
  // Cargar datos al montar el componente
  useEffect(() => {
    fetchPurchases();
    fetchSales();
  }, []);
  
  // Valor del contexto
  const value = {
    // Compras
    purchases,
    purchasesLoading,
    purchasesError,
    fetchPurchases,
    createPurchase,
    getPurchase,
    
    // Ventas
    sales,
    salesLoading,
    salesError,
    fetchSales,
    createSale,
    getSale,
    
    // Recargar ambos
    refreshAll: async () => {
      await Promise.all([fetchPurchases(), fetchSales()]);
    }
  };
  
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

export default TransactionContext;
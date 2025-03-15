// src/pages/Transactions/TransactionsPage.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TransactionProvider } from '../../context/TransactionContext';
import PurchaseHistory from '../../components/Purchase/PurchaseHistory';
import SaleHistory from '../../components/Sale/SaleHistory';
import CreatePurchaseForm from '../../components/Purchase/CreatePurchaseForm';
import CreateSaleForm from '../../components/Sale/CreateSaleForm';
import Modal from '../../components/Modal/Modal';

const Container = styled.div`
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #ddd;
  margin-bottom: 30px;
`;

const Tab = styled.button`
  padding: 15px 25px;
  background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
  color: ${props => props.active ? props.theme.colors.secondary : props.theme.colors.text};
  border: none;
  cursor: pointer;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  transition: all 0.2s;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${props => props.active ? props.theme.colors.primary : 'transparent'};
    transform: ${props => props.active ? 'scaleX(1)' : 'scaleX(0)'};
    transition: transform 0.2s;
  }
  
  &:hover {
    background-color: ${props => props.active ? props.theme.colors.primary : 'rgba(0,0,0,0.05)'};
    
    &:after {
      transform: scaleX(1);
      background-color: ${props => props.active ? props.theme.colors.primary : props.theme.colors.textLight};
    }
  }
`;

const ActionButton = styled.button`
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondary};
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 20px;
  
  &:hover {
    background-color: ${props => props.theme.colors.primaryHover};
    transform: translateY(-2px);
  }
`;

const TabContent = styled.div`
  display: ${props => props.active ? 'block' : 'none'};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  background-color: rgba(255, 0, 0, 0.1);
  border-left: 3px solid ${props => props.theme.colors.danger};
  padding: 15px;
  margin: 20px 0;
  border-radius: 4px;
`;

const TransactionsPage = () => {
  const [activeTab, setActiveTab] = useState('purchases'); // 'purchases' o 'sales'
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  
  // Si no es admin, redirigir al dashboard
  if (!isAdmin) {
    return (
      <Container>
        <ErrorMessage>
          No tienes permisos para acceder a esta página.
        </ErrorMessage>
      </Container>
    );
  }
  
  const handleCreateClick = () => {
    setIsCreateModalOpen(true);
  };
  
  const handleCreateSuccess = () => {
    setIsCreateModalOpen(false);
    // Podría agregar una notificación de éxito aquí
  };
  
  const getModalTitle = () => {
    if (activeTab === 'purchases') {
      return 'Registrar Nueva Compra';
    }
    return 'Registrar Nueva Venta';
  };
  
  const getModalContent = () => {
    if (activeTab === 'purchases') {
      return (
        <CreatePurchaseForm 
          onSuccess={handleCreateSuccess} 
          onCancel={() => setIsCreateModalOpen(false)} 
        />
      );
    }
    
    return (
      <CreateSaleForm 
        onSuccess={handleCreateSuccess} 
        onCancel={() => setIsCreateModalOpen(false)} 
      />
    );
  };
  
  return (
    <TransactionProvider>
      <Container>
        <TabsContainer>
          <Tab 
            active={activeTab === 'purchases'}
            onClick={() => setActiveTab('purchases')}
          >
            Compras
          </Tab>
          <Tab 
            active={activeTab === 'sales'}
            onClick={() => setActiveTab('sales')}
          >
            Ventas
          </Tab>
        </TabsContainer>
        
        <ActionButton onClick={handleCreateClick}>
          + Registrar {activeTab === 'purchases' ? 'Compra' : 'Venta'}
        </ActionButton>
        
        <TabContent active={activeTab === 'purchases'}>
          <PurchaseHistory />
        </TabContent>
        
        <TabContent active={activeTab === 'sales'}>
          <SaleHistory />
        </TabContent>
        
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          title={getModalTitle()}
        >
          {getModalContent()}
        </Modal>
      </Container>
    </TransactionProvider>
  );
};

export default TransactionsPage;
// src/components/Purchase/PurchaseHistory.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useTransactions } from '../../context/TransactionContext';
import Modal from '../Modal/Modal';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Title = styled.h2`
  color: ${props => props.theme.colors.text};
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.small};
`;

const Th = styled.th`
  text-align: left;
  padding: 16px;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
`;

const Td = styled.td`
  padding: 16px;
  border-bottom: 1px solid #eee;
`;

const Tr = styled.tr`
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  &:last-child td {
    border-bottom: none;
  }
`;

const NoRecords = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.colors.textLight};
  font-style: italic;
`;

const InfoBadge = styled.span`
  display: inline-block;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => props.theme.colors.primary};
  color: ${props => props.theme.colors.secondary};
`;

const DetailContainer = styled.div`
  padding: 10px 0;
`;

const DetailTitle = styled.h3`
  margin-bottom: 15px;
  color: ${props => props.theme.colors.text};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const DetailTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px;
  border: 1px solid #eee;
`;

const DetailTh = styled.th`
  text-align: left;
  padding: 12px;
  background-color: #f5f5f5;
  border-bottom: 1px solid #ddd;
`;

const DetailTd = styled.td`
  padding: 12px;
  border-bottom: 1px solid #eee;
`;

const DetailTr = styled.tr`
  &:last-child td {
    border-bottom: none;
  }
`;

const DetailSummary = styled.div`
  background-color: #f9f9f9;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
  text-align: right;
  font-weight: bold;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 30px;
  color: ${props => props.theme.colors.textLight};
`;

const ErrorMessage = styled.div`
  color: ${props => props.theme.colors.danger};
  background-color: rgba(255, 0, 0, 0.1);
  border-left: 3px solid ${props => props.theme.colors.danger};
  padding: 12px;
  border-radius: 4px;
  margin-bottom: 10px;
`;

const PurchaseHistory = () => {
  const [selectedPurchase, setSelectedPurchase] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { 
    purchases, 
    purchasesLoading, 
    purchasesError, 
    fetchPurchases
  } = useTransactions();
  
  useEffect(() => {
    // Recargar compras cuando se monte el componente
    fetchPurchases();
  }, [fetchPurchases]);
  
  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  
  const handleRowClick = (purchase) => {
    setSelectedPurchase(purchase);
    setIsDetailModalOpen(true);
  };
  
  if (purchasesLoading) {
    return <LoadingMessage>Cargando historial de compras...</LoadingMessage>;
  }
  
  if (purchasesError) {
    return <ErrorMessage>{purchasesError}</ErrorMessage>;
  }
  
  return (
    <Container>
      <Title>Historial de Compras</Title>
      
      {purchases.length === 0 ? (
        <NoRecords>No hay registros de compras</NoRecords>
      ) : (
        <Table>
          <thead>
            <tr>
              <Th>Fecha</Th>
              <Th>Proveedor</Th>
              <Th>Productos</Th>
              <Th>Total</Th>
              <Th>Usuario</Th>
            </tr>
          </thead>
          <tbody>
            {purchases.map(purchase => (
              <Tr key={purchase._id} onClick={() => handleRowClick(purchase)}>
                <Td>{formatDate(purchase.date)}</Td>
                <Td>{purchase.supplier || 'No especificado'}</Td>
                <Td>
                  <InfoBadge>{purchase.items.length} productos</InfoBadge>
                </Td>
                <Td>Q {purchase.totalAmount.toFixed(2)}</Td>
                <Td>{purchase.user?.username || 'Sistema'}</Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}
      
      {/* Modal para ver detalles de la compra */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Detalle de Compra"
      >
        {selectedPurchase && (
          <DetailContainer>
            <DetailTitle>
              Compra #{selectedPurchase._id.substring(0, 8)}
              <small>{formatDate(selectedPurchase.date)}</small>
            </DetailTitle>
            
            <p><strong>Proveedor:</strong> {selectedPurchase.supplier || 'No especificado'}</p>
            <p><strong>Registrado por:</strong> {selectedPurchase.user?.username || 'Sistema'}</p>
            
            <h4>Productos comprados:</h4>
            <DetailTable>
              <thead>
                <tr>
                  <DetailTh>Producto</DetailTh>
                  <DetailTh>Cantidad</DetailTh>
                  <DetailTh>Precio Unitario</DetailTh>
                  <DetailTh>Total</DetailTh>
                </tr>
              </thead>
              <tbody>
                {selectedPurchase.items.map((item, index) => (
                  <DetailTr key={index}>
                    <DetailTd>{item.product?.name || 'Producto'}</DetailTd>
                    <DetailTd>{item.quantity}</DetailTd>
                    <DetailTd>Q {item.price.toFixed(2)}</DetailTd>
                    <DetailTd>Q {item.total.toFixed(2)}</DetailTd>
                  </DetailTr>
                ))}
              </tbody>
            </DetailTable>
            
            <DetailSummary>
              Total: Q {selectedPurchase.totalAmount.toFixed(2)}
            </DetailSummary>
          </DetailContainer>
        )}
      </Modal>
    </Container>
  );
};

export default PurchaseHistory;
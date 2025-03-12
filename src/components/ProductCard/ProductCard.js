// src/components/ProductCard/ProductCard.js
import React, { useState } from 'react';
import styled from 'styled-components';
import { getColorCode } from '../../utils/colorUtils';

const Card = styled.div`
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.15);
  }
`;

const ImageContainer = styled.div`
  height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 15px;
  background-color: #f9f9f9;
  border-radius: 4px;
  overflow: hidden;
`;

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #eee;
  color: #999;
  font-size: 32px;
  font-weight: bold;
`;

const ProductImage = styled.img`
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
`;

const ProductName = styled.h3`
  margin: 0 0 10px 0;
  color: #333;
`;

const ProductDetail = styled.p`
  margin: 5px 0;
  color: #666;
`;

const ProductPrice = styled.p`
  margin: 5px 0;
  font-weight: bold;
  color: #e91e63;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
`;

const Button = styled.button`
  background-color: ${props => props.danger ? '#f44336' : '#2196F3'};
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: ${props => props.danger ? '#d32f2f' : '#0b7dda'};
  }
`;

const ColorDot = styled.span`
  display: inline-block;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: ${props => props.color};
  border: 1px solid #ddd;
  margin-right: 8px;
  vertical-align: middle;
`;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductCard = ({ product, onEdit, onDelete }) => {
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <Card>
      <ImageContainer>
        {!imageError && product.image ? (
          <ProductImage 
            src={`${API_URL}/images/${product.image}`}
            alt={product.name}
            onError={handleImageError}
          />
        ) : (
          <Placeholder>
            {product.name.charAt(0).toUpperCase()}
          </Placeholder>
        )}
      </ImageContainer>
      
      <ProductName>{product.name}</ProductName>
      <ProductDetail>Categoría: {product.category}</ProductDetail>
      <ProductDetail>
        <ColorDot color={getColorCode(product.color)} />
        Color: {product.color}
      </ProductDetail>
      
      <ProductPrice>
        Precio: ${parseFloat(product.price).toFixed(2)}
      </ProductPrice>
      
      <ButtonContainer>
        <Button onClick={() => onEdit(product)}>
          Editar
        </Button>
        <Button danger onClick={() => onDelete(product._id)}>
          Eliminar
        </Button>
      </ButtonContainer>
    </Card>
  );
};

export default ProductCard;
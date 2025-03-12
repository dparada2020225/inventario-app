// src/components/ProductForm/ProductForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const FormGroup = styled.div`
  margin-bottom: 15px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.type === 'submit' ? '#4CAF50' : '#607d8b'};
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  
  &:hover {
    background-color: ${props => props.type === 'submit' ? '#45a049' : '#546e7a'};
  }
`;

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    category: '',
    color: '',
    price: '',
    image: ''
  });

  useEffect(() => {
    if (product) {
      setFormData({
        _id: product._id || '',
        name: product.name || '',
        category: product.category || '',
        color: product.color || '',
        price: product.price || '',
        image: product.image || ''
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price)
    });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <input type="hidden" name="_id" value={formData._id} />
      
      <FormGroup>
        <Label htmlFor="name">Nombre:</Label>
        <Input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="category">Categoría:</Label>
        <Input
          type="text"
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="color">Color:</Label>
        <Input
          type="text"
          id="color"
          name="color"
          value={formData.color}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="price">Precio:</Label>
        <Input
          type="number"
          id="price"
          name="price"
          step="0.01"
          min="0"
          value={formData.price}
          onChange={handleChange}
          required
        />
      </FormGroup>
      
      <FormGroup>
        <Label htmlFor="image">URL de Imagen:</Label>
        <Input
          type="text"
          id="image"
          name="image"
          value={formData.image}
          onChange={handleChange}
          placeholder="https://..."
        />
      </FormGroup>
      
      <ButtonGroup>
        <Button type="submit">Guardar</Button>
        <Button type="button" onClick={onCancel}>Cancelar</Button>
      </ButtonGroup>
    </Form>
  );
};

export default ProductForm;
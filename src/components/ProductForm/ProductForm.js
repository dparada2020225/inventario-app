// src/components/ProductForm/ProductForm.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';

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

const ImagePreview = styled.div`
  margin-top: 10px;
  max-width: 200px;
  max-height: 150px;
  img {
    max-width: 100%;
    max-height: 150px;
    border-radius: 4px;
  }
`;

const ErrorMessage = styled.div`
  color: #f44336;
  font-size: 0.8rem;
  margin-top: 5px;
`;

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ProductForm = ({ product, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    _id: '',
    name: '',
    category: '',
    color: '',
    price: '',
    image: null
  });
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        _id: product._id || '',
        name: product.name || '',
        category: product.category || '',
        color: product.color || '',
        price: product.price || '',
        image: product.image || null
      });
      
      // Si hay una imagen, establecer la URL de vista previa
      if (product.image) {
        setPreviewUrl(`${API_URL}/images/${product.image}`);
      }
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo de archivo
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        setError('Por favor selecciona una imagen válida (JPEG, PNG o GIF)');
        setSelectedFile(null);
        setPreviewUrl('');
        return;
      }
      
      // Validar tamaño del archivo (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen debe ser menor a 5MB');
        setSelectedFile(null);
        setPreviewUrl('');
        return;
      }
      
      setError('');
      setSelectedFile(file);
      
      // Crear URL para vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setSelectedFile(null);
      setPreviewUrl('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let imageId = formData.image;
      
      // Si hay un archivo seleccionado, subirlo primero
      if (selectedFile) {
        const formDataFile = new FormData();
        formDataFile.append('image', selectedFile);
        
        const uploadResponse = await axios.post(`${API_URL}/upload`, formDataFile);
        imageId = uploadResponse.data.imageId;
      }
      
      // Después guardar el producto con la referencia a la imagen
      const productData = {
        ...formData,
        price: parseFloat(formData.price),
        image: imageId
      };
      
      onSave(productData);
      setLoading(false);
    } catch (error) {
      console.error('Error al guardar producto:', error);
      setError('Error al guardar producto. Inténtalo de nuevo.');
      setLoading(false);
    }
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
        <Label htmlFor="image">Imagen:</Label>
        <Input
          type="file"
          id="image"
          name="image"
          accept="image/*"
          onChange={handleFileChange}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        
        {previewUrl && (
          <ImagePreview>
            <img src={previewUrl} alt="Vista previa" />
          </ImagePreview>
        )}
        
        {formData.image && !selectedFile && !previewUrl && (
          <div style={{ marginTop: '5px', color: '#666', fontSize: '0.9rem' }}>
            Imagen actual guardada. Sube una nueva para reemplazarla.
          </div>
        )}
      </FormGroup>
      
      <ButtonGroup>
        <Button type="submit" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar'}
        </Button>
        <Button type="button" onClick={onCancel} disabled={loading}>Cancelar</Button>
      </ButtonGroup>
    </Form>
  );
};

export default ProductForm;
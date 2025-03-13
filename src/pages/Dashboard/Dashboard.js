// src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
// import styled from 'styled-components';
import productService from '../../services/api';
import { getColorCode } from '../../utils/colorUtils';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
// Definición de la URL de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';


// Componentes estilizados
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

// Añade esta definición aquí
const ProductCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.08);
  padding: 18px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background-color: ${props => props.theme.colors.primary};
  }
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.12);
  }
`;

const DashboardHeader = styled.header`
  margin-bottom: 30px;
  text-align: center;
`;
const textShine = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`;

const Title = styled.h1`
  color: ${props => props.theme.colors.text};
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 20px;
  position: relative;
  display: inline-block;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: ${props => props.theme.colors.primary};
    border-radius: 2px;
  }
  
  background: linear-gradient(
    to right,
    ${props => props.theme.colors.text} 20%,
    ${props => props.theme.colors.primary} 40%,
    ${props => props.theme.colors.text} 60%
  );
  background-size: 200% auto;
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${textShine} 4s linear infinite;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const StyledButton = styled.button`
  background-color: ${props => 
    props.primary ? props.theme.colors.primary : 
    props.danger ? props.theme.colors.danger : 
    props.theme.colors.secondary};
  color: ${props => props.primary ? props.theme.colors.secondary : 'white'};
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${props => props.theme.shadows.small};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.medium};
    background-color: ${props => 
      props.primary ? props.theme.colors.primaryHover : 
      props.danger ? props.theme.colors.dangerHover : 
      props.theme.colors.secondaryHover};
  }
  
  &:active {
    transform: translateY(1px);
    box-shadow: ${props => props.theme.shadows.small};
  }
`;

const StatsContainer = styled.div`
  text-align: right;
  margin-bottom: 10px;
  color: ${props => props.theme.colors.textLight};
  font-size: 0.9em;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
`;

const NoResults = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px;
  color: ${props => props.theme.colors.textLight};
  font-style: italic;
  background-color: ${props => props.theme.colors.cardBackground};
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.textLight};
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: white;
  background-color: ${props => props.theme.colors.danger};
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SearchContainer = styled.div`
  background-color: ${props => props.theme.colors.cardBackground};
  padding: 20px;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows.small};
  margin-bottom: 20px;
`;

const FilterSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 15px;
`;

const FilterItem = styled.div`
  flex: 1;
  min-width: 200px;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px rgba(150, 255, 0, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

// Componente Dashboard
const Dashboard = () => {
  // Estado para productos y filtros
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para modales
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Estado para filtros
  const [filters, setFilters] = useState({
    searchTerm: '',
    category: '',
    color: '',
    minPrice: '',
    maxPrice: ''
  });

  // Cargar productos al iniciar
  useEffect(() => {
    fetchProducts();
  }, []);

  // Efecto para aplicar filtros cuando cambien
  useEffect(() => {
    applyFilters();
  }, [filters, products]);

  // Función para cargar productos
  const fetchProducts = async () => {
    try {
      setLoading(true);
      console.log('Solicitando productos desde:', `${API_URL}/api/products`);
      const data = await productService.getAllProducts();
      console.log('Productos cargados:', data);
      
      // Añadir esto para ver cómo están formateados los IDs de imagen
      if (data && data.length > 0) {
        console.log('Ejemplo de producto:', data[0]);
        console.log('Ejemplo de ID de imagen:', 
          data[0].image ? `${typeof data[0].image}: ${data[0].image.toString()}` : 'Sin imagen');
      }
      
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      console.error('Error al cargar productos completo:', err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  // Función para aplicar filtros
  const applyFilters = () => {
    const { searchTerm, category, color, minPrice, maxPrice } = filters;
    
    const filtered = products.filter(product => {
      // Filtro por texto de búsqueda
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por categoría
      if (category && product.category !== category) {
        return false;
      }
      
      // Filtro por color
      if (color && product.color !== color) {
        return false;
      }
      
      // Filtro por precio
      const price = parseFloat(product.price);
      if (minPrice && price < parseFloat(minPrice)) {
        return false;
      }
      if (maxPrice && price > parseFloat(maxPrice)) {
        return false;
      }
      
      return true;
    });
    
    setFilteredProducts(filtered);
  };

  // Función para reiniciar filtros
  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      color: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  // Manejadores para acciones
  const handleCreateProduct = () => {
    setCurrentProduct(null);
    setIsProductModalOpen(true);
  };
  
  const handleEditProduct = (product) => {
    setCurrentProduct(product);
    setIsProductModalOpen(true);
  };
  
  const handleSaveProduct = async (product) => {
    try {
      setLoading(true);
      
      if (product._id) {
        // Actualizar producto existente
        await productService.updateProduct(product._id, product);
      } else {
        // Crear nuevo producto (quitar el _id si es un campo vacío)
        const { _id, ...newProduct } = product;
        await productService.createProduct(newProduct);
      }
      
      // Recargar productos para obtener la lista actualizada
      await fetchProducts();
      
      // Cerrar modal
      setIsProductModalOpen(false);
    } catch (err) {
      setError('Error al guardar producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleDeleteClick = (productId) => {
    setProductToDelete(productId);
    setIsDeleteModalOpen(true);
  };
  
  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    try {
      setLoading(true);
      await productService.deleteProduct(productToDelete);
      
      // Recargar productos para obtener la lista actualizada
      await fetchProducts();
      
      // Cerrar modal
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (err) {
      setError('Error al eliminar producto');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportToCSV = async () => {
    try {
      setLoading(true);
      await productService.exportToCSV();
    } catch (err) {
      setError('Error al exportar a CSV');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías y colores únicos para los filtros
  const categories = [...new Set(products.map(p => p.category))].filter(Boolean);
  const colors = [...new Set(products.map(p => p.color))].filter(Boolean);

  // Componente de filtros de búsqueda
  const SearchFilters = () => {
    // Crear estado local para los inputs para evitar re-renders excesivos
    const [localFilters, setLocalFilters] = useState({...filters});

    // Manejar cambios en los inputs sin aplicar los filtros inmediatamente
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setLocalFilters(prev => ({...prev, [name]: value}));
    };

    // Aplicar los filtros cuando se hace clic en el botón Buscar
    const handleSearch = () => {
      setFilters(localFilters);
    };

    // Reiniciar filtros
    const handleReset = () => {
      const emptyFilters = {
        searchTerm: '',
        category: '',
        color: '',
        minPrice: '',
        maxPrice: ''
      };
      setLocalFilters(emptyFilters);
      setFilters(emptyFilters);
    };

    return (
      <SearchContainer>
        <FilterSection>
          <FilterItem>
            <Label htmlFor="searchTerm">Buscar por nombre:</Label>
            <Input
              type="text"
              id="searchTerm"
              name="searchTerm"
              value={localFilters.searchTerm}
              onChange={handleInputChange}
              placeholder="Escribe para buscar..."
            />
          </FilterItem>
          
          <FilterItem>
            <Label htmlFor="category">Categoría:</Label>
            <Select
              id="category"
              name="category"
              value={localFilters.category}
              onChange={handleInputChange}
            >
              <option value="">Todas las categorías</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </Select>
          </FilterItem>
          
          <FilterItem>
            <Label htmlFor="color">Color:</Label>
            <Select
              id="color"
              name="color"
              value={localFilters.color}
              onChange={handleInputChange}
            >
              <option value="">Todos los colores</option>
              {colors.map(color => (
                <option key={color} value={color}>{color}</option>
              ))}
            </Select>
          </FilterItem>
        </FilterSection>
        
        <FilterSection>
          <FilterItem>
            <Label htmlFor="minPrice">Precio mínimo:</Label>
            <Input
              type="number"
              id="minPrice"
              name="minPrice"
              value={localFilters.minPrice}
              onChange={handleInputChange}
              placeholder="Mínimo"
            />
          </FilterItem>
          
          <FilterItem>
            <Label htmlFor="maxPrice">Precio máximo:</Label>
            <Input
              type="number"
              id="maxPrice"
              name="maxPrice"
              value={localFilters.maxPrice}
              onChange={handleInputChange}
              placeholder="Máximo"
            />
          </FilterItem>
        </FilterSection>
        
        <StyledButton primary onClick={handleSearch}>Buscar</StyledButton>
        <StyledButton onClick={handleReset} style={{marginLeft: '10px', backgroundColor: props => props.theme.colors.danger}}>
          Reiniciar filtros
        </StyledButton>
      </SearchContainer>
    );
  };

  // Renderizar tarjeta de producto
  const renderProductCard = (product) => {
    // Función para manejar errores de imagen de manera limpia
    const handleImageError = (e) => {
      console.error(`Error cargando imagen para ${product.name}:`, e);
      e.target.style.display = 'none';
      const container = e.target.parentNode;
      // Limpiar el contenedor
      while (container.firstChild) {
        container.removeChild(container.firstChild);
      }
      // Crear un placeholder
      const placeholder = document.createElement('div');
      placeholder.style.fontSize = '24px';
      placeholder.style.color = '#ccc';
      placeholder.style.display = 'flex';
      placeholder.style.justifyContent = 'center';
      placeholder.style.alignItems = 'center';
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.textContent = product.name.charAt(0).toUpperCase();
      container.appendChild(placeholder);
    };

    return (
      <ProductCard key={product._id} style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        padding: '15px',
        marginBottom: '20px',
        borderTop: `3px solid ${props => props.theme.colors.primary}`
      }}>
        <div style={{
          height: '150px',
          backgroundColor: '#f5f5f5',
          borderRadius: '4px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '10px'
        }}>
          {product.image ? (
            <>
              {console.log('URL de imagen:', `${API_URL}/images/${product.image}`)}
              <img
                src={`${API_URL}/images/${product.image}`}
                alt={product.name}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
                onError={handleImageError}
              />
            </>
          ) : (
            <div style={{
              fontSize: '24px',
              color: '#ccc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              width: '100%',
              height: '100%'
            }}>
              {product.name.charAt(0).toUpperCase()}
            </div>
          )}
        </div>
        
        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px' }}>{product.name}</h3>
        <p style={{ margin: '5px 0', color: '#666', fontSize: '14px' }}>Categoría: {product.category}</p>
        <p style={{ margin: '5px 0', color: '#666', fontSize: '14px', display: 'flex', alignItems: 'center' }}>
          <span style={{ 
            display: 'inline-block',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: getColorCode(product.color),
            border: '1px solid #ddd',
            marginRight: '8px'
          }}></span>
          Color: {product.color}
        </p>
        <p style={{ margin: '10px 0', fontWeight: 'bold', color: '#96ff00', backgroundColor: '#222', display: 'inline-block', padding: '3px 8px', borderRadius: '4px' }}>
          Precio: ${parseFloat(product.price).toFixed(2)}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
        <StyledButton onClick={() => handleEditProduct(product)} style={{backgroundColor: '#2196F3'}}>
          Editar
        </StyledButton>
        <StyledButton danger onClick={() => handleDeleteClick(product._id)}>
          Eliminar
        </StyledButton>
        </div>
      </ProductCard>
    );
  };

  // Componente Modal
  const Modal = ({ isOpen, title, onClose, children }) => {
    if (!isOpen) return null;
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '15px'}}>
            <h2 style={{margin: 0}}>{title}</h2>
            <button onClick={onClose} style={{background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer'}}>×</button>
          </div>
          {children}
        </div>
      </div>
    );
  };

  // Componente ProductForm
  const ProductForm = ({ product, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
      _id: product?._id || '',
      name: product?.name || '',
      category: product?.category || '',
      color: product?.color || '',
      price: product?.price || '',
      image: product?.image || null
    });
    
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      if (product && product.image) {
        setPreviewUrl(`${API_URL}/images/${product.image}`);
      }
    }, [product]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        // Validar tipo y tamaño
        const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg'];
        if (!validTypes.includes(file.type)) {
          setError('Por favor selecciona una imagen válida (JPEG, PNG o GIF)');
          return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
          setError('La imagen debe ser menor a 5MB');
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
      } catch (error) {
        console.error('Error al guardar producto:', error);
        setError('Error al guardar producto. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="_id" value={formData._id} />
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: props => props.theme.colors.text}}>Nombre:</label>
          <Input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: props => props.theme.colors.text}}>Categoría:</label>
          <Input 
            type="text" 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: props => props.theme.colors.text}}>Color:</label>
          <Input 
            type="text" 
            name="color" 
            value={formData.color} 
            onChange={handleChange}
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: props => props.theme.colors.text}}>Precio:</label>
          <Input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px', fontWeight: '600', color: props => props.theme.colors.text}}>Imagen:</label>
          <Input 
            type="file" 
            name="image" 
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {error && <div style={{color: 'red', fontSize: '0.8rem', marginTop: '5px'}}>{error}</div>}
          
          {previewUrl && (
            <div style={{marginTop: '10px', maxWidth: '200px'}}>
              <img 
                src={previewUrl} 
                alt="Vista previa" 
                style={{maxWidth: '100%', maxHeight: '150px', borderRadius: '4px'}}
              />
            </div>
          )}
          
          {formData.image && !selectedFile && !previewUrl && (
            <div style={{marginTop: '5px', color: '#666', fontSize: '0.9rem'}}>
              Imagen actual guardada. Sube una nueva para reemplazarla.
            </div>
          )}
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
          <StyledButton 
            type="submit" 
            style={{
              backgroundColor: '#96ff00', 
              color: '#222',
            }}
            disabled={loading}
          >
            {loading ? 'Guardando...' : 'Guardar'}
          </StyledButton>
          <StyledButton 
            type="button" 
            onClick={onCancel} 
            style={{backgroundColor: '#607d8b', color: 'white'}}
            disabled={loading}
          >
            Cancelar
          </StyledButton>
        </div>
      </form>
    );
  };

  // Componente ConfirmDialog
  const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          maxWidth: '400px',
          width: '90%',
        }}>
          <h2 style={{margin: '0 0 15px 0'}}>{title}</h2>
          <p>{message}</p>
          <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
            <StyledButton 
              onClick={onConfirm} 
              style={{backgroundColor: '#f44336', color: 'white'}}>
              Eliminar
            </StyledButton>
            <StyledButton 
              onClick={onCancel}
              style={{backgroundColor: '#607d8b', color: 'white'}}>
              Cancelar
            </StyledButton>
          </div>
        </div>
      </div>
    );
  };

  // Renderizado del componente principal
  return (
    <Container>
      <DashboardHeader>
        <Title>Sistema de Inventario</Title>
      </DashboardHeader>
      
      <ActionsContainer>

          <StyledButton primary onClick={handleCreateProduct}>
            Crear Nuevo Producto
          </StyledButton>

          <StyledButton onClick={handleExportToCSV} style={{backgroundColor: '#222'}}>
            Exportar a CSV
          </StyledButton>

      </ActionsContainer>
      
      <SearchFilters />
      
      {error && <ErrorMessage>{error}</ErrorMessage>}
      
      {loading ? (
        <LoadingIndicator>Cargando productos...</LoadingIndicator>
      ) : (
        <>
          <StatsContainer>
            Mostrando <strong>{filteredProducts.length}</strong> de <strong>{products.length}</strong> productos
          </StatsContainer>
          
          <ProductGrid>
            {filteredProducts.length > 0 ? (
              filteredProducts.map(product => renderProductCard(product))
            ) : (
              <NoResults>
                No se encontraron productos que coincidan con los criterios de búsqueda
              </NoResults>
            )}
          </ProductGrid>
        </>
      )}
      
      <Modal 
        isOpen={isProductModalOpen}
        title={currentProduct ? 'Editar Producto' : 'Crear Nuevo Producto'}
        onClose={() => setIsProductModalOpen(false)}
      >
        <ProductForm 
          product={currentProduct}
          onSave={handleSaveProduct}
          onCancel={() => setIsProductModalOpen(false)}
        />
      </Modal>
      
      <ConfirmDialog 
        isOpen={isDeleteModalOpen}
        title="Confirmar Eliminación"
        message="¿Estás seguro de que deseas eliminar este producto?"
        onConfirm={confirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </Container>
  );
};

export default Dashboard;
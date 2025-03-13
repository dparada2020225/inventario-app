// src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import productService from '../../services/api';
import { getColorCode } from '../../utils/colorUtils';
import axios from 'axios';
import ProductForm from '../../components/ProductForm/ProductForm';
import Modal from '../../components/Modal/Modal';
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog';
import ProductCard from '../../components/ProductCard/ProductCard';

// Definición de la URL de la API
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

// Animaciones
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

// Componentes estilizados
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
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
  
  & > * {
    animation: ${fadeIn} 0.4s ease forwards;
    opacity: 0;
  }
  
  & > *:nth-child(1) { animation-delay: 0.1s; }
  & > *:nth-child(2) { animation-delay: 0.2s; }
  & > *:nth-child(3) { animation-delay: 0.3s; }
  & > *:nth-child(4) { animation-delay: 0.4s; }
  & > *:nth-child(5) { animation-delay: 0.5s; }
  & > *:nth-child(6) { animation-delay: 0.6s; }
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px rgba(150, 255, 0, 0.2);
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
    box-shadow: 0 0 0 2px rgba(150, 255, 0, 0.2);
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
        <StyledButton onClick={handleReset} style={{marginLeft: '10px', backgroundColor: '#f44336'}}>
          Reiniciar filtros
        </StyledButton>
      </SearchContainer>
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
              filteredProducts.map(product => (
                <ProductCard 
                  key={product._id} 
                  product={product} 
                  onEdit={handleEditProduct} 
                  onDelete={handleDeleteClick}
                />
              ))
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
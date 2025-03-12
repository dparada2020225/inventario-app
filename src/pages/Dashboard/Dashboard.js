// src/pages/Dashboard/Dashboard.js
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import productService from '../../services/api';
// Importar utilidades
import { getColorCode, getColorName } from '../../utils/colorUtils';

// Componentes estilizados
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Header = styled.header`
  margin-bottom: 30px;
  text-align: center;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 10px;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Button = styled.button`
  background-color: ${props => props.primary ? '#4CAF50' : '#2196F3'};
  color: white;
  border: none;
  padding: 10px 15px;
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  
  &:hover {
    background-color: ${props => props.primary ? '#45a049' : '#0b7dda'};
  }
`;

const StatsContainer = styled.div`
  text-align: right;
  margin-bottom: 10px;
  color: #666;
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
  color: #777;
  font-style: italic;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
`;

const LoadingIndicator = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #666;
`;

const ErrorMessage = styled.div`
  text-align: center;
  padding: 2rem;
  font-size: 1.2rem;
  color: #f44336;
  background-color: #ffebee;
  border-radius: 8px;
  margin-bottom: 1rem;
`;

const SearchContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  color: #555;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
`;

// Función para convertir nombres de colores a códigos HEX
// const getColorCode = (colorName) => {
//   if (!colorName) return '#cccccc';
  
//   const colorMap = {
//     'rojo': '#ff0000',
//     'verde': '#00ff00',
//     'azul': '#0000ff',
//     'amarillo': '#ffff00',
//     'negro': '#000000',
//     'blanco': '#ffffff',
//     'gris': '#808080',
//     'naranja': '#ffa500',
//     'morado': '#800080',
//     'rosa': '#ffc0cb',
//     'marrón': '#a52a2a',
//     'celeste': '#87ceeb',
//     'dorado': '#ffd700',
//     'plateado': '#c0c0c0',
//     'cromado': '#e8e8e8'
//   };
  
//   return colorMap[colorName.toLowerCase()] || '#cccccc';
// };

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
      const data = await productService.getAllProducts();
      setProducts(data);
      setFilteredProducts(data);
      setError(null);
    } catch (err) {
      setError('Error al cargar productos');
      console.error(err);
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
      
      <Button primary onClick={handleSearch}>Buscar</Button>
      <Button onClick={handleReset} style={{marginLeft: '10px', backgroundColor: '#f44336'}}>
        Reiniciar filtros
      </Button>
    </SearchContainer>
  );
};

  // Renderizar tarjeta de producto
  const renderProductCard = (product) => {
    return (
      <div key={product._id} style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        padding: '15px',
        marginBottom: '20px'
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
            <img
              src={product.image}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = product.name.charAt(0).toUpperCase();
              }}
            />
          ) : (
            <div style={{
              fontSize: '24px',
              color: '#ccc'
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
        <p style={{ margin: '10px 0', fontWeight: 'bold', color: '#e91e63' }}>
          Precio: ${parseFloat(product.price).toFixed(2)}
        </p>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '15px' }}>
          <button 
            onClick={() => handleEditProduct(product)}
            style={{
              backgroundColor: '#2196F3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}>
            Editar
          </button>
          <button 
            onClick={() => handleDeleteClick(product._id)}
            style={{
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              padding: '6px 12px',
              cursor: 'pointer'
            }}>
            Eliminar
          </button>
        </div>
      </div>
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
      image: product?.image || ''
    });

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      onSave({...formData, price: parseFloat(formData.price)});
    };

    return (
      <form onSubmit={handleSubmit}>
        <input type="hidden" name="_id" value={formData._id} />
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Nombre:</label>
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange}
            style={{width: '100%', padding: '8px'}}
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Categoría:</label>
          <input 
            type="text" 
            name="category" 
            value={formData.category} 
            onChange={handleChange}
            style={{width: '100%', padding: '8px'}}
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Color:</label>
          <input 
            type="text" 
            name="color" 
            value={formData.color} 
            onChange={handleChange}
            style={{width: '100%', padding: '8px'}}
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>Precio:</label>
          <input 
            type="number" 
            name="price" 
            value={formData.price} 
            onChange={handleChange}
            style={{width: '100%', padding: '8px'}}
            step="0.01"
            min="0"
            required
          />
        </div>
        
        <div style={{marginBottom: '15px'}}>
          <label style={{display: 'block', marginBottom: '5px'}}>URL de Imagen:</label>
          <input 
            type="text" 
            name="image" 
            value={formData.image} 
            onChange={handleChange}
            style={{width: '100%', padding: '8px'}}
            placeholder="https://..."
          />
        </div>
        
        <div style={{display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px'}}>
          <button type="submit" style={{backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px'}}>
            Guardar
          </button>
          <button type="button" onClick={onCancel} style={{backgroundColor: '#607d8b', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px'}}>
            Cancelar
          </button>
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
            <button 
              onClick={onConfirm} 
              style={{backgroundColor: '#f44336', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px'}}>
              Eliminar
            </button>
            <button 
              onClick={onCancel}
              style={{backgroundColor: '#607d8b', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '4px'}}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Renderizado del componente principal
  return (
    <Container>
      <Header>
        <Title>Sistema de Inventario</Title>
      </Header>
      
      <ActionsContainer>
        <Button primary onClick={handleCreateProduct}>
          Crear Nuevo Producto
        </Button>
        <Button onClick={handleExportToCSV}>
          Exportar a CSV
        </Button>
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
// src/components/SearchFilters/SearchFilters.js
import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
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
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
  
  &:focus {
    border-color: ${props => props.theme.colors.primary};
    outline: none;
  }
`;

const Button = styled.button`
  background-color: ${props => props.primary ? props.theme.colors.primary : props.theme.colors.danger};
  color: ${props => props.primary ? props.theme.colors.secondary : 'white'};
  border: none;
  padding: 10px 15px;
  margin-right: ${props => props.primary ? '10px' : '0'};
  cursor: pointer;
  border-radius: 4px;
  font-weight: bold;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-2px);
    background-color: ${props => props.primary ? props.theme.colors.primaryHover : props.theme.colors.dangerHover || '#d32f2f'};
  }
`;

// Para botones secundarios o de acción menos importante
const SecondaryButton = styled.button`
  background-color: transparent;
  color: ${props => props.danger ? '#f44336' : '#96ff00'};
  border: 2px solid ${props => props.danger ? '#f44336' : '#96ff00'};
  padding: 8px 14px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.danger ? 'rgba(244, 67, 54, 0.1)' : 'rgba(150, 255, 0, 0.1)'};
  }
`;

const SearchFilters = ({ filters, setFilters, categories, colors }) => {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const resetFilters = () => {
    setFilters({
      searchTerm: '',
      category: '',
      color: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <Container>
      <FilterSection>
        <FilterItem>
          <Label htmlFor="searchTerm">Buscar por nombre:</Label>
          <Input
            type="text"
            id="searchTerm"
            name="searchTerm"
            value={filters.searchTerm || ''}
            onChange={handleInputChange}
            placeholder="Escribe para buscar..."
          />
        </FilterItem>
        
        <FilterItem>
          <Label htmlFor="category">Categoría:</Label>
          <Select
            id="category"
            name="category"
            value={filters.category || ''}
            onChange={handleInputChange}
          >
            <option value="">Todas las categorías</option>
            {categories && categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </Select>
        </FilterItem>
        
        <FilterItem>
          <Label htmlFor="color">Color:</Label>
          <Select
            id="color"
            name="color"
            value={filters.color || ''}
            onChange={handleInputChange}
          >
            <option value="">Todos los colores</option>
            {colors && colors.map(color => (
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
            value={filters.minPrice || ''}
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
            value={filters.maxPrice || ''}
            onChange={handleInputChange}
            placeholder="Máximo"
          />
        </FilterItem>
      </FilterSection>
      
      <Button primary="true" onClick={() => {}}>Buscar</Button>
      <Button onClick={resetFilters}>Reiniciar filtros</Button>
    </Container>
  );
};

export default SearchFilters;
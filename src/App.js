// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle } from 'styled-components';
import Dashboard from './pages/Dashboard/Dashboard';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: #f5f5f5;
  }
  
  * {
    box-sizing: border-box;
  }
`;

// Componente Header temporal simplificado
const Header = () => (
  <header style={{
    backgroundColor: '#4CAF50',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{margin: 0, fontSize: '1.5rem'}}>Sistema de Inventario</h1>
      <nav>
        <a href="/" style={{color: 'white', textDecoration: 'none', marginLeft: '20px'}}>Inicio</a>
      </nav>
    </div>
  </header>
);

// Componente ProductProvider temporal para evitar errores
const ProductProvider = ({ children }) => {
  return children;
};

function App() {
  return (
    <Router>
      <GlobalStyle />
      <ProductProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}>Página no encontrada</div>} />
        </Routes>
      </ProductProvider>
    </Router>
  );
}

export default App;
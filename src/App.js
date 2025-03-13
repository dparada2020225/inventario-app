// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Dashboard from './pages/Dashboard/Dashboard';
import { theme } from './theme';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.colors.background};
  }
  
  * {
    box-sizing: border-box;
  }

  h1, h2, h3 {
    color: ${props => props.theme.colors.text};
  }
`;

// Componente Header temporal simplificado
const Header = () => (
  <header style={{
    backgroundColor: theme.colors.secondary,
    color: 'white',
    padding: '15px 0',
    boxShadow: theme.shadows.small
  }}>
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <h1 style={{margin: 0, fontSize: '1.5rem'}}>
        <img src="/logotipo.png" alt="Reconstructora Antigua Jr." style={{ height: '35px' }} />
      </h1>
      <nav>
        <a href="/" style={{color: theme.colors.primary, textDecoration: 'none', marginLeft: '20px'}}>Inicio</a>
      </nav>
    </div>
  </header>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <Header />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}>Página no encontrada</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
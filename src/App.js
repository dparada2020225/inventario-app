// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { createGlobalStyle, ThemeProvider } from 'styled-components';
import Dashboard from './pages/Dashboard/Dashboard';
import Header from './components/Header/Header'; // Importar el componente Header
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <GlobalStyle />
        <Header /> {/* Usar el componente Header externo */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="*" element={<div style={{padding: '40px', textAlign: 'center'}}>Página no encontrada</div>} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
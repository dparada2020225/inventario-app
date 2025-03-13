// src/components/Header/Header.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 15px 0;
  box-shadow: ${props => props.theme.shadows.small};
`;

const Content = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  text-decoration: none;
  display: flex;
  align-items: center;
`;

const LogoImage = styled.img`
  height: 38px; // Ajusta la altura según necesites
  display: block;
`;

const Nav = styled.nav`
  display: flex;
  gap: 20px;
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: rgba(150, 255, 0, 0.15);
    transform: translateY(-2px);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <Content>
        <Logo to="/">
          <LogoImage src="/logotipoPng.png" alt="Reconstructora Antigua Jr." />
        </Logo>
        <Nav>
          <NavLink to="/">Productos</NavLink>
          <NavLink to="/about">Acerca de</NavLink>
        </Nav>
      </Content>
    </HeaderContainer>
  );
};

export default Header;
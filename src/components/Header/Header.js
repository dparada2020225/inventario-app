// src/components/Header/Header.js
import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const HeaderContainer = styled.header`
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  padding: 8px 0;  /* Reducido de 15px a 8px */
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
  height: 42px; /* Reducido de 38px a 30px */
  display: block;
`;

const Nav = styled.nav`
  display: flex;
  gap: 15px; /* Reducido de 20px a 15px */
`;

const NavLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  padding: 4px 10px; /* Reducido de 6px 12px a 4px 10px */
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
          <LogoImage src="/logotipoPng2.png" alt="Reconstructora Antigua Jr." />
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
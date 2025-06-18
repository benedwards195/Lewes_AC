import { NavLink as RouterNavLink } from 'react-router-dom';
import styled from 'styled-components';

//  export const NavLink = styled(RouterNavLink) `
//        display: flex;
//   gap: 1rem;
//   background: #f8f8f8;
//   padding: 1rem;

//     &:hover {
//     color: #007bff; 
//     text-decoration: underline;
//     }

//     &.active {
//     font-weight: bold;
//     color: #0056b3;
//   }
//       `;
// nav-styles.jsx

export const NavbarWrapper = styled.nav`
  background: #f8f8f8;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  font-weight: bold;

  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
  }
`;

export const Hamburger = styled.button`
  font-size: 1.5rem;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1rem;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const NavLinks = styled.div`
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  flex-direction: column;
  gap: 1rem;

  @media (min-width: 768px) {
    display: flex !important;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
  }
`;

export const NavLink = styled(RouterNavLink)`
       display: flex;
  gap: 1rem;
  background: #f8f8f8;
  padding: 1rem;
  color: #000;
  text-decoration: none;

    &:hover {
    color: purple;
    text-decoration: underline;
    }

    &.active {
    font-weight: bold;
    color: #000;
  }

 
   
`;

export const Logo = styled.img`
  height: 45px;
  margin-top: 0.5rem;

  @media (min-width: 768px) {
    margin-left: auto;
  }
`;


      

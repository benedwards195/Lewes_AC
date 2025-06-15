import { NavLink as RouterNavLink } from 'react-router-dom';
import styled from 'styled-components';

 export const NavLink = styled(RouterNavLink) `
       display: flex;
  gap: 1rem;
  background: #f8f8f8;
  padding: 1rem;

    &:hover {
    color: #007bff; 
    text-decoration: underline;
    }

    &.active {
    font-weight: bold;
    color: #0056b3;
  }
      `;

import { useState } from 'react';
import logo from '../../images/lewes-ac.jpg.png';
import { Hamburger, Logo, NavbarWrapper, NavLink, NavLinks } from './nav-styles.jsx';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(prev => !prev);

  return (
    <NavbarWrapper>
      <Hamburger onClick={toggleMenu}>☰</Hamburger>

      <NavLinks isOpen={isOpen}>
        <NavLink to="/" end onClick={() => setIsOpen(false)}>Home</NavLink>
        <NavLink to="/monday" onClick={() => setIsOpen(false)}>Monday Strength & Conditioning</NavLink>
        <NavLink to="/tuesday" onClick={() => setIsOpen(false)}>Tuesday Training</NavLink>
        <NavLink to="/thursday" onClick={() => setIsOpen(false)}>Thursday Track Training</NavLink>
        <NavLink to="/saturday" onClick={() => setIsOpen(false)}>Saturday Training</NavLink>
        <NavLink to="/sunday" onClick={() => setIsOpen(false)}>Sunday Trail Training</NavLink>
      </NavLinks>

      <Logo src={logo} alt="Lewes AC logo" />
    </NavbarWrapper>
  );
};

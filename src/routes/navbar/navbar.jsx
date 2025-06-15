import { NavLink } from './nav-styles.jsx';

export const Navbar = () => {
    return (
        <>
    <nav className="navbar">
        <NavLink to="/" end>Home</NavLink>
        <NavLink to="/monday">Monday Strength & Conditioning</NavLink>
        <NavLink to="/tuesday">Tuesday Training</NavLink>
        <NavLink to="/thursday">Thursday Track Training</NavLink>
        <NavLink to="/saturday">Saturday Training</NavLink>
        <NavLink to="/sunday">Sunday Trail Training</NavLink>
    </nav>
    </>
    )
}
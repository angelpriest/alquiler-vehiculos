import { Link } from "react-router-dom";
import "../styles/Navbar.css";

function Navbar() {
    return (
    <nav className="navbar">
        <div className="navbar-content">
            <Link to="/" className="navbar-brand">
                Alquilercar
            </Link>
            <ul className="navbar-links">
                <li>
                    <Link to="/">Inicio</Link>
                </li>
                <li>
                    <Link to="/vehiculos">Vehículos</Link>
                </li>
                <li>
                    <Link to="/admin">Administración</Link>
                </li>
            </ul>    
        </div>
    </nav>
    );
}

export default Navbar;
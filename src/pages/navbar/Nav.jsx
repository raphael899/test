import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../../styles/Navbar.css";
import { setAuthenticated } from "../../redux/user/userActions";

const Navbar = () => {
  const isAuthenticated = useSelector(state => state.user.isAuthenticated);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    dispatch(setAuthenticated(false)); // Actualizar el estado de autenticación
    navigate("/"); // Redirigir al inicio después de hacer logout
  };

  useEffect(() => {
    if (isAuthenticated) {
      // Si estamos autenticados, mostrar inmediatamente el menú del navbar
      setIsLoggedIn(true);
    }
  }, [isAuthenticated]);

  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated);

  // Verificar la ubicación actual para mostrar o ocultar el menú del navbar
  useEffect(() => {
    if (location.pathname === "/") {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(isAuthenticated);
    }
  }, [location.pathname, isAuthenticated]);

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <h1>Bienvenido</h1>
      </div>
      {isLoggedIn && (
        <ul className="navbar-list">
          <li className="navbar-item">
            <Link to="/transport/maritime" className="navbar-link">
              Maritime Transport
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/transport/ground" className="navbar-link">
              Ground Transport
            </Link>
          </li>
          <li className="navbar-item">
            <button onClick={handleLogout} className="navbar-link">
              Logout
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;

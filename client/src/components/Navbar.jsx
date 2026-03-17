import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { FaBars, FaTimes, FaRegHeart } from "react-icons/fa";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const getDashboardPath = () => {
    if (!user) return "/login";

    switch (user.role) {
      case "patient":
        return "/dashboard-patient";
      case "doctor":
        return "/dashboard-doctor";
      case "clinic":
        return "/dashboard-clinic";
      case "admin":
        return "/admin";
      default:
        return "/";
    }
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="site-header">
      <div className="page-container">
        <nav className="site-navbar">
          <Link to="/" className="brand-logo" onClick={closeMenu}>
            <div className="brand-icon">
              <FaRegHeart />
            </div>
            <div className="brand-text">
              <span className="brand-name">HealthLink</span>
              <span className="brand-tagline">Smart Medical Services Platform</span>
            </div>
          </Link>

          <div className={`nav-center ${menuOpen ? "open" : ""}`}>
            <NavLink to="/" onClick={closeMenu}>
              Home
            </NavLink>
            <NavLink to="/clinics" onClick={closeMenu}>
              Clinics
            </NavLink>
            <NavLink to="/doctor-profile" onClick={closeMenu}>
              Doctors
            </NavLink>
            <NavLink to="/chatbot" onClick={closeMenu}>
              AI Assistant
            </NavLink>
          </div>

          <div className={`nav-actions ${menuOpen ? "open" : ""}`}>
            {user ? (
              <>
                <Link to={getDashboardPath()} className="secondary-btn" onClick={closeMenu}>
                  Dashboard
                </Link>
                <button className="primary-btn nav-auth-btn" onClick={handleLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="secondary-btn" onClick={closeMenu}>
                  Sign In
                </Link>
                <Link to="/register" className="primary-btn nav-auth-btn" onClick={closeMenu}>
                  Create Account
                </Link>
              </>
            )}
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Navbar.css";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/">HealthLink</Link>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <span>
              {user.first_name} {user.last_name} ({user.role})
            </span>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <span>Vizitator</span>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Login.css";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const getRedirectPathByRole = (role) => {
    switch (role) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await login(formData);
      navigate(getRedirectPathByRole(data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || "A aparut o eroare la autentificare.");
    }
  };

  return (
    <div className="login-page">
      <h1>Autentificare</h1>

      <form className="login-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          type="password"
          name="password"
          placeholder="Parola"
          value={formData.password}
          onChange={handleChange}
        />

        <button type="submit">Login</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Login;
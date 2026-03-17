import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/Register.css";

function Register() {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "patient",
  });

  const [error, setError] = useState("");

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

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await register(formData);
      navigate(getRedirectPathByRole(data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || "A aparut o eroare la inregistrare.");
    }
  };

  return (
    <div className="register-page">
      <h1>Creare cont</h1>

      <form className="register-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="firstName"
          placeholder="Prenume"
          value={formData.firstName}
          onChange={handleChange}
        />

        <input
          type="text"
          name="lastName"
          placeholder="Nume"
          value={formData.lastName}
          onChange={handleChange}
        />

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

        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="patient">Pacient</option>
          <option value="doctor">Doctor</option>
          <option value="clinic">Clinica</option>
          <option value="admin">Administrator</option>
        </select>

        <button type="submit">Register</button>
      </form>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default Register;
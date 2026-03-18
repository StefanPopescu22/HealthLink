import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaArrowRight,
  FaEnvelope,
  FaHospital,
  FaLock,
  FaShieldAlt,
  FaUser,
  FaUserMd,
} from "react-icons/fa";
import "../styles/Register.css";
import Footer from "../components/Footer";

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
    <main className="register-page-medical">
      <div className="page-container register-grid">
        <section className="register-info-panel">
          <div className="register-badge">
            <FaShieldAlt />
            <span>Modern healthcare onboarding</span>
          </div>

          <h1 className="register-title">
            Create your <span className="gradient-text">HealthLink</span> profile
          </h1>

          <p className="register-subtitle">
            Build a secure digital identity for accessing clinics, managing appointments,
            storing documents and using AI-powered healthcare support.
          </p>

          <div className="register-role-cards">
            <article className="register-role-card">
              <div className="register-role-icon">
                <FaUser />
              </div>
              <div>
                <h3>Patient Access</h3>
                <p>Schedule consultations, manage analyses and use the chatbot assistant.</p>
              </div>
            </article>

            <article className="register-role-card">
              <div className="register-role-icon">
                <FaUserMd />
              </div>
              <div>
                <h3>Doctor & Clinic Access</h3>
                <p>Organize appointments, patient information and healthcare workflows.</p>
              </div>
            </article>

            <article className="register-role-card">
              <div className="register-role-icon">
                <FaHospital />
              </div>
              <div>
                <h3>Connected Medical Ecosystem</h3>
                <p>Bring multiple healthcare actors into one coordinated digital platform.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="register-form-panel">
          <div className="register-form-card">
            <div className="register-form-header">
              <h2>Create account</h2>
              <p>Complete the form below to start using the platform.</p>
            </div>

            <form className="register-form-medical" onSubmit={handleSubmit}>
              <div className="register-row">
                <div className="register-input-group">
                  <label>Prenume</label>
                  <div className="register-input-wrapper">
                    <FaUser />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="Prenume"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="register-input-group">
                  <label>Nume</label>
                  <div className="register-input-wrapper">
                    <FaUser />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Nume"
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="register-input-group">
                <label>Email</label>
                <div className="register-input-wrapper">
                  <FaEnvelope />
                  <input
                    type="email"
                    name="email"
                    placeholder="Adresa de email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label>Parola</label>
                <div className="register-input-wrapper">
                  <FaLock />
                  <input
                    type="password"
                    name="password"
                    placeholder="Creeaza o parola"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label>Rol</label>
                <div className="register-select-wrapper">
                  <select name="role" value={formData.role} onChange={handleChange}>
                    <option value="patient">Pacient</option>
                    <option value="doctor">Doctor</option>
                    <option value="clinic">Clinica</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>

              {error && <p className="register-error">{error}</p>}

              <button type="submit" className="primary-btn register-submit-btn">
                Create Account
                <FaArrowRight />
              </button>
            </form>

            <div className="register-footer-note">
              <span>Ai deja cont?</span>
              <Link to="/login">Autentifica-te</Link>
            </div>
          </div>
        </section>
      </div>
     <Footer />
    </main>
      
  );
}

export default Register;
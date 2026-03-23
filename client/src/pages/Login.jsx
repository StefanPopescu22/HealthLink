import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaEnvelope,
  FaLock,
  FaArrowRight,
  FaShieldAlt,
  FaHeartbeat,
  FaUserMd,
} from "react-icons/fa";
import "../styles/Login.css";
import Footer from "../components/Footer";

function Login() {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
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
      const data = await login(formData);
      navigate(getRedirectPathByRole(data.user.role));
    } catch (err) {
      setError(err.response?.data?.message || "A aparut o eroare la autentificare.");
    }
  };

  return (
    <main className="auth-page login-theme">
      <div className="page-container auth-grid">
        <section className="auth-info-panel">
          <div className="auth-badge">
            <FaShieldAlt />
            <span>Secure medical access</span>
          </div>

          <h1 className="auth-title">
            Connect to your <span className="gradient-text">HealthLink</span> account
          </h1>

          <p className="auth-subtitle">
            Access appointments, medical documents, clinic recommendations and your
            personalized healthcare dashboard through a secure and modern interface.
          </p>

          <div className="auth-feature-list">
            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <FaHeartbeat />
              </div>
              <div>
                <h3>Personal medical access</h3>
                <p>Review appointments, records and healthcare interactions in one place.</p>
              </div>
            </div>

            <div className="auth-feature-item">
              <div className="auth-feature-icon">
                <FaUserMd />
              </div>
              <div>
                <h3>Multi-role platform</h3>
                <p>Dedicated access flows for patients, doctors, clinics and administrators.</p>
              </div>
            </div>
          </div>

          <div className="auth-preview-card">
            <div className="preview-header">
              <span>Trusted workflow</span>
              <span className="preview-status">Encrypted</span>
            </div>

            <div className="preview-lines">
              <div className="preview-line large"></div>
              <div className="preview-line"></div>
              <div className="preview-line short"></div>
            </div>

            <div className="preview-bottom">
              <div className="preview-mini-card">
                <strong>Appointments</strong>
                <span>Fast access</span>
              </div>
              <div className="preview-mini-card">
                <strong>AI Assistant</strong>
                <span>Guided support</span>
              </div>
            </div>
          </div>
        </section>

        <section className="auth-form-panel">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <h2>Welcome back</h2>
              <p>Sign in to continue your medical journey with HealthLink.</p>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              <div className="input-group">
                <label>Email</label>
                <div className="input-wrapper">
                  <FaEnvelope />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Password</label>
                <div className="input-wrapper">
                  <FaLock />
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter the password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && <p className="auth-error">{error}</p>}

              <button type="submit" className="primary-btn auth-submit-btn">
                Sign In
                <FaArrowRight />
              </button>
            </form>

            <div className="auth-footer-note">
              <span>Don't have an account?</span>
              <Link to="/register">Sign Up</Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
}

export default Login;
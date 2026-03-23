import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaArrowRight,
  FaEnvelope,
  FaLock,
  FaShieldAlt,
  FaUser,
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
  });

  const [error, setError] = useState("");

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
      await register(formData);
      navigate("/dashboard-patient");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed.");
    }
  };

  return (
    <main className="register-page-medical">
      <div className="page-container register-grid">
        <section className="register-info-panel">
          <div className="register-badge">
            <FaShieldAlt />
            <span>Patient self-signup</span>
          </div>

          <h1 className="register-title">
            Create your <span className="gradient-text">patient account</span>
          </h1>

          <p className="register-subtitle">
            Public registration is available only for patients. Clinic, doctor and
            administrator accounts are created internally through secured role-based workflows.
          </p>
        </section>

        <section className="register-form-panel">
          <div className="register-form-card">
            <div className="register-form-header">
              <h2>Create patient account</h2>
              <p>Complete the form to access your healthcare workspace.</p>
            </div>

            <form className="register-form-medical" onSubmit={handleSubmit}>
              <div className="register-row">
                <div className="register-input-group">
                  <label>First Name</label>
                  <div className="register-input-wrapper">
                    <FaUser />
                    <input
                      type="text"
                      name="firstName"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="register-input-group">
                  <label>Last Name</label>
                  <div className="register-input-wrapper">
                    <FaUser />
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Last name"
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
                    placeholder="Email address"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="register-input-group">
                <label>Password</label>
                <div className="register-input-wrapper">
                  <FaLock />
                  <input
                    type="password"
                    name="password"
                    placeholder="Create password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {error && <p className="register-error">{error}</p>}

              <button type="submit" className="primary-btn register-submit-btn">
                Create Patient Account
                <FaArrowRight />
              </button>
            </form>

            <div className="register-footer-note">
              <span>Already have an account?</span>
              <Link to="/login">Sign in</Link>
            </div>
          </div>
        </section>
      </div>
     <Footer/>
    </main>
      
  );
}

export default Register;
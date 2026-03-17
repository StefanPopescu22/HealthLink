import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaBrain,
  FaCalendarCheck,
  FaLock,
  FaHospital,
  FaHouseMedical,
  FaShieldHeart,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import "../styles/Home.css";

function Home() {
  const features = [

    {
      icon: <FaHospital />,
      title: "Unified Medical Records",
      text: "Centralize your consultations, analyses, prescriptions and important health documents in one secure platform.",
    },
    {
      icon: <FaBrain />,
      title: "AI Symptom Assistant",
      text: "Describe your symptoms in natural language and receive guided specialist recommendations and clinic suggestions.",
    },
    {
      icon: <FaLock />,
      title: "Secure & Compliant",
      text: "Built with privacy, role-based access and data protection principles suitable for modern healthcare systems.",
    },
    {
      icon: <FaUserDoctor />,
      title: "Multi-Role Access",
      text: "Separate workflows for patients, doctors, clinics and administrators in a single connected ecosystem.",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Smart Appointments",
      text: "Search, schedule, manage and review medical appointments through a clean and intuitive interface.",
    },
    {
      icon: <FaHouseMedical />,
      title: "Clinic Discovery",
      text: "Browse clinics by city, specialty and rating, then compare services and select the best option faster.",
    },
    
  ];

  const steps = [
    {
      number: "01",
      title: "Create your account",
      text: "Register securely and choose the flow that fits your role in the platform.",
    },
    {
      number: "02",
      title: "Complete your profile",
      text: "Add essential data, medical preferences and personal information for a tailored experience.",
    },
    {
      number: "03",
      title: "Find the right provider",
      text: "Explore clinics, specialties and doctors using filters, recommendations and search tools.",
    },
    {
      number: "04",
      title: "Book and manage care",
      text: "Create appointments, upload medical documents and track your interactions in one place.",
    },
  ];

  return (
    <main className="home-wrapper">
      <section className="hero-section">
        <div className="page-container hero-grid">
          <div className="hero-content">
            <div className="glass-badge hero-badge">
              <HiOutlineSparkles />
              <span>AI-powered healthcare experience</span>
            </div>

            <h1 className="page-title hero-title">
              Your medical services,
              <span className="gradient-text"> connected, modern and accessible</span>
            </h1>

            <p className="section-subtitle hero-subtitle">
              HealthLink helps patients, doctors and clinics work together through
              secure records, appointment scheduling, document management and an
              intelligent medical assistant.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-btn">
                Get Started
                <FaArrowRight />
              </Link>

              <Link to="/login" className="secondary-btn">
                Explore Platform
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <FaShieldHeart />
                <span>Secure medical data handling</span>
              </div>
              <div className="trust-item">
                <FaStethoscope />
                <span>Specialist-oriented recommendations</span>
              </div>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card hero-main-card">
              <div className="hero-card-header">
                <span>Patient Dashboard Preview</span>
                <span className="status-pill">Live</span>
              </div>

              <div className="hero-stats">
                <div className="mini-stat">
                  <strong>24</strong>
                  <span>Clinics</span>
                </div>
                <div className="mini-stat">
                  <strong>12</strong>
                  <span>Doctors</span>
                </div>
                <div className="mini-stat">
                  <strong>8</strong>
                  <span>AI Consultations</span>
                </div>
              </div>

              <div className="appointment-preview">
                <div className="appointment-left">
                  <div className="doctor-avatar">DR</div>
                  <div>
                    <h4>Dr. Elena Popescu</h4>
                    <p>Cardiology Consultation</p>
                  </div>
                </div>
                <div className="appointment-status confirmed">Confirmed</div>
              </div>

              <div className="appointment-preview">
                <div className="appointment-left">
                  <div className="doctor-avatar">AI</div>
                  <div>
                    <h4>Symptom Assistant</h4>
                    <p>Suggested specialty: Dermatology</p>
                  </div>
                </div>
                <div className="appointment-status pending">New</div>
              </div>
            </div>

            <div className="floating-card floating-card-top">
              <span>Medical documents</span>
              <strong>Always available</strong>
            </div>

            <div className="floating-card floating-card-bottom">
              <span>Role-based access</span>
              <strong>Patient · Doctor · Clinic · Admin</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="page-container">
          <div className="home-section-heading center">
            <h2 className="section-title">Comprehensive healthcare platform</h2>
            <p className="section-subtitle">
              Designed to support patient journeys, provider coordination and
              modern medical service management.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, index) => (
              <article className="soft-card feature-card" key={index}>
                <div className="icon-box">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing how-section">
        <div className="page-container">
          <div className="home-section-heading">
            <h2 className="section-title">How HealthLink works</h2>
            <p className="section-subtitle">
              A simple flow for turning fragmented healthcare interactions into a
              connected digital experience.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, index) => (
              <article className="soft-card step-card" key={index}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="page-container">
          <div className="cta-banner">
            <div className="cta-content">
              <h2>Ready to build your digital healthcare experience?</h2>
              <p>
                Start with a modern platform that supports appointments, medical
                documents, clinic discovery and AI-assisted guidance.
              </p>
            </div>

            <div className="cta-actions">
              <Link to="/register" className="secondary-btn cta-btn">
                Create Your Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="page-container footer-content">
          <div>
            <h3>HealthLink</h3>
            <p>Healthcare platform for connected medical services.</p>
          </div>

          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/chatbot">AI Assistant</Link>
          </div>
        </div>

        <div className="page-container footer-bottom">
          <p>© 2026 HealthLink. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
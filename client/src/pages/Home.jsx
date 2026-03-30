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
  FaStar,
  FaChevronRight,
} from "react-icons/fa6";
import { HiOutlineSparkles } from "react-icons/hi2";
import "../styles/Home.css";

/* ── Data ─────────────────────────────────────────────────────── */
const features = [
  {
    icon: <FaHospital />,
    title: "Unified Medical Records",
    text: "Centralize consultations, analyses, prescriptions and health documents in one secure platform.",
    accent: "#2563eb",
  },
  {
    icon: <FaBrain />,
    title: "AI Symptom Assistant",
    text: "Describe symptoms in natural language and receive guided specialist and clinic recommendations.",
    accent: "#7c3aed",
  },
  {
    icon: <FaLock />,
    title: "Secure & Compliant",
    text: "Built with privacy, role-based access and data protection principles for modern healthcare.",
    accent: "#0891b2",
  },
  {
    icon: <FaUserDoctor />,
    title: "Multi-Role Access",
    text: "Separate workflows for patients, doctors, clinics and administrators in one ecosystem.",
    accent: "#059669",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Smart Appointments",
    text: "Search, schedule, manage and review medical appointments through a clean interface.",
    accent: "#d97706",
  },
  {
    icon: <FaHouseMedical />,
    title: "Clinic Discovery",
    text: "Browse clinics by city, specialty and rating. Compare services and choose the best option.",
    accent: "#dc2626",
  },
];

const steps = [
  { number: "01", title: "Create your account", text: "Register securely and choose the flow that fits your role in the platform." },
  { number: "02", title: "Complete your profile", text: "Add essential data, medical preferences and personal information for a tailored experience." },
  { number: "03", title: "Find the right provider", text: "Explore clinics, specialties and doctors using filters, recommendations and search tools." },
  { number: "04", title: "Book and manage care", text: "Create appointments, upload documents and track your healthcare interactions in one place." },
];

const stats = [
  { value: "50+", label: "Clinics registered" },
  { value: "200+", label: "Doctors available" },
  { value: "1k+", label: "Appointments made" },
  { value: "99%", label: "Uptime reliability" },
];

const testimonials = [
  {
    name: "Dr. Elena Popescu",
    role: "Cardiologist · HealthLink Doctor",
    text: "Managing my schedule and patient documents has never been easier. HealthLink truly transformed my daily workflow.",
    rating: 5,
  },
  {
    name: "Andrei Constantin",
    role: "Patient · Active since 2024",
    text: "The AI assistant recommended the right specialist in seconds. I booked my appointment the same day.",
    rating: 5,
  },
  {
    name: "Clinica MedLife Vest",
    role: "Clinic Partner · Timișoara",
    text: "Our clinic visibility grew significantly after joining HealthLink. Patient management is seamless.",
    rating: 5,
  },
];

/* ── Component ────────────────────────────────────────────────── */
function Home() {
  return (
    <main className="home-wrapper">

      {/* ══════════════════════════════ HERO ══════════════════════════════ */}
      <section className="hero-section">
        {/* Mesh background */}
        <div className="hero-mesh" aria-hidden="true">
          <div className="mesh-blob mesh-blob-1" />
          <div className="mesh-blob mesh-blob-2" />
          <div className="mesh-blob mesh-blob-3" />
        </div>

        <div className="page-container hero-grid">
          {/* Left */}
          <div className="hero-content">
            <div className="glass-badge hero-badge">
              <HiOutlineSparkles />
              <span>AI-powered healthcare platform</span>
            </div>

            <h1 className="page-title hero-title">
              Your medical care,
              <span className="gradient-text"> connected and modern</span>
            </h1>

            <p className="section-subtitle hero-subtitle">
              HealthLink brings patients, doctors and clinics into one secure workspace — with
              smart appointments, AI symptom guidance and complete medical record management.
            </p>

            <div className="hero-actions">
              <Link to="/register" className="primary-btn hero-cta-primary">
                Get Started Free
                <FaArrowRight />
              </Link>
              <Link to="/clinics" className="secondary-btn hero-cta-secondary">
                Explore Clinics
              </Link>
            </div>

            <div className="hero-trust">
              <div className="trust-item">
                <FaShieldHeart />
                <span>GDPR-compliant data handling</span>
              </div>
              <div className="trust-item">
                <FaStethoscope />
                <span>Specialist-oriented recommendations</span>
              </div>
            </div>
          </div>

          {/* Right — Dashboard card */}
          <div className="hero-visual">
            <div className="hero-main-card">
              <div className="hero-card-header">
                <div className="hero-card-title">
                  <div className="hero-card-dot" />
                  <span>Patient Dashboard</span>
                </div>
                <span className="status-pill">● Live</span>
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
                  <span>AI Chats</span>
                </div>
              </div>

              <div className="appointment-preview">
                <div className="appointment-left">
                  <div className="doctor-avatar gradient-avatar">DR</div>
                  <div>
                    <h4>Dr. Elena Popescu</h4>
                    <p>Cardiology · Tomorrow 10:00</p>
                  </div>
                </div>
                <div className="appointment-status confirmed">Confirmed</div>
              </div>

              <div className="appointment-preview">
                <div className="appointment-left">
                  <div className="doctor-avatar ai-avatar">AI</div>
                  <div>
                    <h4>Symptom Assistant</h4>
                    <p>Suggested: Dermatology</p>
                  </div>
                </div>
                <div className="appointment-status pending">New</div>
              </div>

              {/* Progress bar inside card */}
              <div className="hero-card-progress">
                <div className="hcp-label">
                  <span>Profile completeness</span>
                  <span>78%</span>
                </div>
                <div className="hcp-bar">
                  <div className="hcp-fill" style={{ width: "78%" }} />
                </div>
              </div>
            </div>

            {/* Floating chips */}
            <div className="floating-chip chip-top">
              <FaLock />
              <span>End-to-end encrypted</span>
            </div><br/>
            <br/>
            
          
            <div className="floating-chip chip-bottom">
              <FaUserDoctor />
              <span>Patient · Doctor · Clinic · Admin</span>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ STATS BAR ═════════════════════════════ */}
      <section className="stats-bar-section">
        <div className="page-container">
          <div className="stats-bar">
            {stats.map((s, i) => (
              <div className="stat-bar-item" key={i}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FEATURES ══════════════════════════════ */}
      <section className="section-spacing features-section">
        <div className="page-container">
          <div className="home-section-heading center">
            <div className="section-tag">Platform capabilities</div>
            <h2 className="section-title">Everything your healthcare needs</h2>
            <p className="section-subtitle">
              Designed for patients, providers and administrators — one platform,
              every workflow.
            </p>
          </div>

          <div className="features-grid">
            {features.map((feature, i) => (
              <article className="feature-card" key={i} style={{ "--feature-accent": feature.accent }}>
                <div className="feature-icon-wrap">
                  <div className="feature-icon">{feature.icon}</div>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
                <div className="feature-link">
                  Learn more <FaChevronRight />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ PLATFORM SHOWCASE ═════════════════════════ */}
      {/* This is where the Uiverse card lives — adapted for HealthLink */}
      <section className="showcase-section section-spacing">
        <div className="page-container">
          <div className="showcase-grid">

            {/* Left — text */}
            <div className="showcase-text">
              <div className="section-tag">Premium access</div>
              <h2 className="section-title">
                A platform built for{" "}
                <span className="gradient-text">every role</span>
              </h2>
              <p className="section-subtitle">
                Whether you're a patient tracking your health, a doctor managing
                appointments, or a clinic administrator overseeing operations —
                HealthLink gives you the right tools, instantly.
              </p>

              <ul className="showcase-list">
                {[
                  "Dedicated dashboards per role",
                  "Real-time appointment management",
                  "AI-guided medical recommendations",
                  "Secure document storage & sharing",
                ].map((item, i) => (
                  <li key={i}>
                    <span className="showcase-check">✓</span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link to="/register" className="primary-btn showcase-cta">
                Start for Free <FaArrowRight />
              </Link>
            </div>

            {/* Right — Uiverse card (adapted for HealthLink) */}
            <div className="showcase-card-wrap">
              {/* The Uiverse card — adapted colors to fit HealthLink dark navy aesthetic */}
              <div className="uv-card">
                <div className="uv-border" />
                <div className="uv-content">
                  <div className="uv-logo">
                    <div className="uv-logo-icon">
                      <FaShieldHeart />
                    </div>
                    <div className="uv-logo-text">HealthLink</div>
                    <span className="uv-trail" />
                  </div>
                  <span className="uv-logo-bottom-text">healthcare platform</span>
                </div>
                <span className="uv-bottom-text">your health · connected</span>
              </div>

              {/* Decorative cards around it */}
              <div className="deco-card deco-card-1">
                <span>Appointments</span>
                <strong>Today: 3 visits</strong>
              </div>
              <div className="deco-card deco-card-2">
                <span>Documents</span>
                <strong>12 files secure</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ HOW IT WORKS ════════════════════════════ */}
      <section className="section-spacing how-section">
        <div className="page-container">
          <div className="home-section-heading center">
            <div className="section-tag">Simple workflow</div>
            <h2 className="section-title">Up and running in minutes</h2>
            <p className="section-subtitle">
              From registration to your first appointment — everything is built to
              be intuitive and fast.
            </p>
          </div>

          <div className="steps-grid">
            {steps.map((step, i) => (
              <article className="step-card" key={i}>
                <span className="step-number">{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
                {i < steps.length - 1 && (
                  <div className="step-connector" aria-hidden="true" />
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════ TESTIMONIALS ══════════════════════════════ */}
      <section className="section-spacing testimonials-section">
        <div className="page-container">
          <div className="home-section-heading center">
            <div className="section-tag">What they say</div>
            <h2 className="section-title">Trusted by patients & providers</h2>
          </div>

          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <article className="testimonial-card" key={i}>
                <div className="testimonial-stars">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <div className="testimonial-author">
                  <div className="testimonial-avatar">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <strong>{t.name}</strong>
                    <span>{t.role}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CTA ═══════════════════════════════ */}
      <section className="section-spacing">
        <div className="page-container">
          <div className="cta-banner">
            <div className="cta-glow" aria-hidden="true" />
            <div className="cta-content">
              <div className="section-tag cta-tag">Get started today</div>
              <h2>Ready for a better healthcare experience?</h2>
              <p>
                Join patients, doctors and clinics already using HealthLink to
                simplify medical care management.
              </p>
            </div>
            <div className="cta-actions">
              <Link to="/register" className="cta-btn-primary">
                Create Free Account <FaArrowRight />
              </Link>
              <Link to="/login" className="cta-btn-secondary">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════ FOOTER ════════════════════════════════ */}
      <footer className="home-footer">
        <div className="page-container footer-content">
          <div className="footer-brand">
            <h3>HealthLink</h3>
            <p>Modern healthcare platform for connected medical services.</p>
          </div>
          <div className="footer-links">
            <Link to="/">Home</Link>
            <Link to="/clinics">Clinics</Link>
            <Link to="/doctors">Doctors</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
            <Link to="/chatbot">AI Assistant</Link>
          </div>
        </div>
        <div className="page-container footer-bottom">
          <p>© 2026 HealthLink. All rights reserved.</p>
          <p>Built with care for modern healthcare.</p>
        </div>
      </footer>
    </main>
  );
}

export default Home;
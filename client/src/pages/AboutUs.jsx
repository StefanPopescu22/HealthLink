import { Link } from "react-router-dom";
import {
  FaShieldHeart,
  FaUserDoctor,
  FaHospital,
  FaBrain,
  FaLock,
  FaCalendarCheck,
  FaArrowRight,
  FaHeartPulse,
  FaUsers,
  FaCircleCheck,
  FaChartLine,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/AboutUs.css";

const values = [
  {
    icon: <FaShieldHeart />,
    title: "Patient-First Design",
    text: "Every feature is designed with the patient experience at the center. From booking to documents, simplicity and clarity are non-negotiable.",
  },
  {
    icon: <FaLock />,
    title: "Privacy & Security",
    text: "Medical data is handled with the highest level of care. Role-based access and secure data practices protect every account on the platform.",
  },
  {
    icon: <FaBrain />,
    title: "AI-Guided Navigation",
    text: "The integrated AI assistant helps patients navigate specialties and clinics — not to replace doctors, but to reduce uncertainty and save time.",
  },
  {
    icon: <FaCalendarCheck />,
    title: "Seamless Appointments",
    text: "Scheduling a consultation should take seconds. HealthLink connects patients directly with clinics and doctors through a streamlined booking flow.",
  },
];

const team = [
  {
    initials: "AP",
    name: "Alexandru Popescu",
    role: "Founder & Product Lead",
    description: "Passionate about digital health and building systems that make healthcare more accessible.",
  },
  {
    initials: "IM",
    name: "Ioana Marinescu",
    role: "Backend Engineer",
    description: "Designs the data architecture, API logic and security infrastructure powering HealthLink.",
  },
  {
    initials: "DV",
    name: "Diana Voinea",
    role: "Frontend Developer",
    description: "Crafts the visual experience across all patient, doctor and clinic interfaces.",
  },
];

const milestones = [
  { year: "2024", event: "HealthLink concept founded as a university thesis project." },
  { year: "Q1 2025", event: "Core patient and clinic workflows built and tested internally." },
  { year: "Q2 2025", event: "AI symptom assistant integrated with 19 specialty categories." },
  { year: "Q3 2025", event: "Doctor and admin panel completed. Multi-role architecture finalized." },
  { year: "2026", event: "MVP deployed. Public-facing platform available for real users." },
];

function AboutUs() {
  return (
    <>
      <main className="about-page">
        <div className="page-container">

          <section className="about-hero">
            <div className="about-hero-inner">
              <div className="about-hero-tag">
                <FaHeartPulse />
                <span>Our Story</span>
              </div>
              <h1 className="about-hero-title">
                Healthcare, connected
                <span className="gradient-text"> for everyone</span>
              </h1>
              <p className="about-hero-subtitle">
                HealthLink was built with a single purpose: to remove the friction
                between patients and the medical care they need. We believe that
                finding a doctor, booking an appointment or accessing your health
                history should be as simple as any modern digital experience.
              </p>
              <div className="about-hero-actions">
                <Link to="/register" className="primary-btn">
                  Get Started <FaArrowRight />
                </Link>
                <Link to="/clinics" className="secondary-btn">
                  Explore Clinics
                </Link>
              </div>
            </div>

            <div className="about-hero-visual">
              <div className="about-stat-card">
                <FaUsers />
                <strong>Multi-role</strong>
                <span>Patients · Doctors · Clinics · Admins</span>
              </div>
              <div className="about-stat-card">
                <FaHospital />
                <strong>All-in-one</strong>
                <span>Appointments, Documents, AI & Reviews</span>
              </div>
              <div className="about-stat-card">
                <FaChartLine />
                <strong>Data-driven</strong>
                <span>Real-time dashboards for every role</span>
              </div>
              <div className="about-stat-card">
                <FaBrain />
                <strong>AI-powered</strong>
                <span>19 specialty categories covered</span>
              </div>
            </div>
          </section>

          <section className="about-mission">
            <div className="about-section-tag">Our Mission</div>
            <div className="about-mission-grid">
              <div className="about-mission-text">
                <h2 className="section-title">
                  Built to make healthcare <span className="gradient-text">less complicated</span>
                </h2>
                <p>
                  The healthcare journey is fragmented. Patients struggle to find the
                  right doctor. Clinics manage appointments manually. Doctors lack a
                  unified view of their patients. HealthLink was designed to solve all
                  of this in a single, connected platform.
                </p>
                <p>
                  We provide separate, purpose-built experiences for each role —
                  patients, doctors, clinic administrators and platform admins — so
                  that every interaction is relevant, fast and clear.
                </p>
                <ul className="about-mission-list">
                  <li><FaCircleCheck /> Patients book appointments and manage their health records</li>
                  <li><FaCircleCheck /> Doctors review schedules and add medical observations</li>
                  <li><FaCircleCheck /> Clinics manage their teams, services and patient flow</li>
                  <li><FaCircleCheck /> Admins oversee the entire platform from a control panel</li>
                </ul>
              </div>
              <div className="about-mission-image">
                <div className="about-image-card">
                  <div className="about-image-icon"><FaShieldHeart /></div>
                  <div className="about-image-content">
                    <strong>Trusted Platform</strong>
                    <p>Role-based access, secure data handling and medical-grade care for your information.</p>
                  </div>
                </div>
                <div className="about-image-card">
                  <div className="about-image-icon"><FaUserDoctor /></div>
                  <div className="about-image-content">
                    <strong>5 Actor Types</strong>
                    <p>Visitor, Patient, Doctor, Clinic and Administrator — each with dedicated workflows.</p>
                  </div>
                </div>
                <div className="about-image-card">
                  <div className="about-image-icon"><FaBrain /></div>
                  <div className="about-image-content">
                    <strong>AI Assistant</strong>
                    <p>Symptom-based navigation across 19 medical specialties without replacing doctors.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="about-values">
            <div className="about-section-tag">Core Values</div>
            <h2 className="section-title about-values-title">
              Principles that guide <span className="gradient-text">every decision</span>
            </h2>
            <div className="about-values-grid">
              {values.map((v, i) => (
                <article className="about-value-card" key={i}>
                  <div className="about-value-icon">{v.icon}</div>
                  <h3>{v.title}</h3>
                  <p>{v.text}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-timeline">
            <div className="about-section-tag">Journey</div>
            <h2 className="section-title about-timeline-title">
              How HealthLink <span className="gradient-text">came to life</span>
            </h2>
            <div className="about-timeline-list">
              {milestones.map((m, i) => (
                <div className="about-timeline-item" key={i}>
                  <div className="about-timeline-dot" />
                  <div className="about-timeline-content">
                    <span className="about-timeline-year">{m.year}</span>
                    <p>{m.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="about-team">
            <div className="about-section-tag">Team</div>
            <h2 className="section-title about-team-title">
              The people behind <span className="gradient-text">HealthLink</span>
            </h2>
            <div className="about-team-grid">
              {team.map((member, i) => (
                <article className="about-team-card" key={i}>
                  <div className="about-team-avatar">{member.initials}</div>
                  <h3>{member.name}</h3>
                  <span className="about-team-role">{member.role}</span>
                  <p>{member.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="about-cta">
            <div className="about-cta-glow" aria-hidden="true" />
            <div className="about-cta-content">
              <h2>Ready to experience HealthLink?</h2>
              <p>
                Join patients, doctors and clinics already using the platform to
                simplify and improve how healthcare is managed and accessed.
              </p>
            </div>
            <div className="about-cta-actions">
              <Link to="/register" className="about-cta-btn-primary">
                Create Free Account <FaArrowRight />
              </Link>
              <Link to="/faq" className="about-cta-btn-secondary">
                Read the FAQ
              </Link>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default AboutUs;

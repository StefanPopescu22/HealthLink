import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaChartLine,
  FaClock,
  FaFileMedical,
  FaHeartPulse,
  FaHospital,
  FaNotesMedical,
  FaRobot,
  FaShieldHeart,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/DashboardPatient.css";
import DashboardSidebar from "../components/DashboardSidebar";

function DashboardPatient() {
  const stats = [
    {
      icon: <FaCalendarCheck />,
      value: "04",
      label: "Upcoming Appointments",
      trend: "+2 this month",
    },
    {
      icon: <FaFileMedical />,
      value: "18",
      label: "Medical Documents",
      trend: "3 recently added",
    },
    {
      icon: <FaHospital />,
      value: "07",
      label: "Favorite Clinics",
      trend: "2 new matches",
    },
    {
      icon: <FaChartLine />,
      value: "92%",
      label: "Profile Completion",
      trend: "Almost ready",
    },
  ];

  const upcomingAppointments = [
    {
      doctor: "Dr. Elena Popescu",
      specialty: "Cardiology Consultation",
      clinic: "Central Heart Clinic",
      date: "March 28, 2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      doctor: "Dr. Andrei Marinescu",
      specialty: "Dermatology Check",
      clinic: "DermaCare Center",
      date: "April 02, 2026",
      time: "02:15 PM",
      status: "Pending",
    },
  ];

  const recentDocuments = [
    {
      title: "Blood Test Results",
      type: "Analysis",
      date: "March 12, 2026",
    },
    {
      title: "Chest X-Ray Report",
      type: "Medical Document",
      date: "March 05, 2026",
    },
    {
      title: "Dermatology Prescription",
      type: "Prescription",
      date: "February 26, 2026",
    },
  ];

  const recommendedClinics = [
    {
      name: "MedFuture Clinic",
      specialty: "Cardiology & Internal Medicine",
      city: "Bucharest",
      rating: "4.9",
    },
    {
      name: "LifeCare Medical Hub",
      specialty: "Dermatology & Diagnostics",
      city: "Sibiu",
      rating: "4.8",
    },
  ];

    const quickActions = [
    {
      icon: <FaCalendarCheck />,
      title: "Book Appointment",
      text: "Schedule a new consultation with a doctor or clinic.",
      link: "/appointments",
    },
    {
      icon: <FaNotesMedical />,
      title: "Medical Documents",
      text: "Store analyses, prescriptions and important medical files.",
      link: "/medical-documents",
    },
    {
      icon: <FaRobot />,
      title: "Ask AI Assistant",
      text: "Describe symptoms and get specialty recommendations.",
      link: "/chatbot",
    },
    ];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <div className="page-container">
          <section className="patient-hero">
            <div className="patient-hero-content">
              <div className="patient-hero-badge">
                <FaShieldHeart />
                <span>Secure Patient Workspace</span>
              </div>

              <h1 className="patient-hero-title">
                Welcome back to your{" "}
                <span className="gradient-text">HealthLink Dashboard</span>
              </h1>

              <p className="patient-hero-subtitle">
                Manage appointments, track documents, explore clinics and use the
                AI assistant to navigate your healthcare journey with confidence.
              </p>

              <div className="patient-hero-actions">
                <Link to="/clinics" className="primary-btn">
                  Explore Clinics
                  <FaArrowRight />
                </Link>

                <Link to="/chatbot" className="secondary-btn">
                  Open AI Assistant
                </Link>
              </div>
            </div>

            <div className="patient-hero-panel soft-card">
              <div className="patient-panel-header">
                <span>Health Overview</span>
                <span className="patient-status-pill">Active</span>
              </div>

              <div className="patient-panel-grid">
                <div className="patient-panel-item">
                  <strong>Next Visit</strong>
                  <span>March 28, 2026</span>
                </div>
                <div className="patient-panel-item">
                  <strong>Main Specialty</strong>
                  <span>Cardiology</span>
                </div>
                <div className="patient-panel-item">
                  <strong>Documents</strong>
                  <span>18 stored files</span>
                </div>
                <div className="patient-panel-item">
                  <strong>AI Activity</strong>
                  <span>5 recent chats</span>
                </div>
              </div>
            </div>
          </section>

          <section className="patient-stats-grid">
            {stats.map((item, index) => (
              <article className="patient-stat-card soft-card" key={index}>
                <div className="patient-stat-top">
                  <div className="icon-box">{item.icon}</div>
                  <span className="patient-stat-trend">{item.trend}</span>
                </div>

                <h3>{item.value}</h3>
                <p>{item.label}</p>
              </article>
            ))}
          </section>

          <section className="patient-dashboard-main">
            <div className="patient-dashboard-left">
              <article className="soft-card patient-section-card">
                <div className="patient-section-header">
                  <div>
                    <h2>Upcoming Appointments</h2>
                    <p>Your next scheduled medical visits.</p>
                  </div>

                  <Link to="/appointments" className="patient-inline-link">
                    Manage
                  </Link>
                </div>

                <div className="patient-appointments-list">
                  {upcomingAppointments.map((appointment, index) => (
                    <div className="patient-appointment-item" key={index}>
                      <div className="patient-appointment-main">
                        <div className="patient-avatar-box">
                          <FaUserDoctor />
                        </div>

                        <div>
                          <h3>{appointment.doctor}</h3>
                          <p>{appointment.specialty}</p>
                          <span>
                            {appointment.clinic} · {appointment.date} · {appointment.time}
                          </span>
                        </div>
                      </div>

                      <div
                        className={`patient-appointment-status ${
                          appointment.status.toLowerCase()
                        }`}
                      >
                        {appointment.status}
                      </div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="soft-card patient-section-card">
                <div className="patient-section-header">
                  <div>
                    <h2>Recent Medical Documents</h2>
                    <p>Latest uploaded analyses and reports.</p>
                  </div>
                  <Link to="/medical-documents" className="patient-inline-link">
                    View all
                  </Link>
                </div>

                <div className="patient-documents-list">
                  {recentDocuments.map((doc, index) => (
                    <div className="patient-document-item" key={index}>
                      <div className="patient-document-icon">
                        <FaFileMedical />
                      </div>

                      <div className="patient-document-content">
                        <h3>{doc.title}</h3>
                        <p>{doc.type}</p>
                      </div>

                      <span className="patient-document-date">{doc.date}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="patient-dashboard-right">
              <article className="soft-card patient-side-card patient-progress-card">
                <div className="patient-section-header small">
                  <div>
                    <h2>Health Profile</h2>
                    <p>Keep your medical data updated.</p>
                  </div>
                </div>

                <div className="patient-progress-ring">
                  <div className="patient-progress-inner">
                    <strong>92%</strong>
                    <span>Completed</span>
                  </div>
                </div>

                <ul className="patient-check-list">
                  <li>Personal details updated</li>
                  <li>Blood group added</li>
                  <li>Allergies documented</li>
                  <li>Emergency info pending</li>
                </ul>
              </article>

              <article className="soft-card patient-side-card">
                <div className="patient-section-header small">
                  <div>
                    <h2>Recommended Clinics</h2>
                    <p>Suggested for your recent activity.</p>
                  </div>
                </div>

                <div className="patient-clinics-list">
                  {recommendedClinics.map((clinic, index) => (
                    <div className="patient-clinic-item" key={index}>
                      <div>
                        <h3>{clinic.name}</h3>
                        <p>{clinic.specialty}</p>
                        <span>{clinic.city}</span>
                      </div>

                      <div className="patient-rating-badge">{clinic.rating}</div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="soft-card patient-side-card patient-ai-card">
                <div className="patient-ai-top">
                  <div className="patient-ai-icon">
                    <FaRobot />
                  </div>
                  <div>
                    <h2>AI Health Assistant</h2>
                    <p>Symptom guidance and specialty suggestions.</p>
                  </div>
                </div>

                <div className="patient-ai-tags">
                  <span><FaStethoscope /> Symptom Check</span>
                  <span><FaClock /> Fast Suggestions</span>
                  <span><FaHeartPulse /> Guided Care</span>
                </div>

                <Link to="/chatbot" className="primary-btn patient-ai-btn">
                  Start Conversation
                  <FaArrowRight />
                </Link>
              </article>
            </div>
          </section>

          <section className="patient-quick-actions-section">
            <div className="patient-section-heading">
              <h2 className="section-title">Quick Actions</h2>
              <p className="section-subtitle">
                Access the most important patient actions in a single place.
              </p>
            </div>

            <div className="patient-quick-actions-grid">
              {quickActions.map((action, index) => (
                <article className="soft-card patient-action-card" key={index}>
                  <div className="icon-box">{action.icon}</div>
                  <h3>{action.title}</h3>
                  <p>{action.text}</p>
                  <Link to={action.link} className="patient-inline-link">
                    Open action
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DashboardPatient;
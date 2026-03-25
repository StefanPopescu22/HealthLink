import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaFileMedical,
  FaRobot,
  FaShieldHeart,
  FaStar,
  FaStethoscope,
  FaUserDoctor,
  FaUserGroup,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DashboardDoctor.css";

function DashboardDoctor() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/doctor/dashboard");
        setData(response.data);
      } catch (err) {
        setError("Failed to load doctor dashboard.");
      }
    };

    loadDashboard();
  }, []);

  if (!data) {
    return (
      <>
        <main className="dashboard-screen">
          <div className="page-container dashboard-shell-grid">
            <DashboardSidebar />
            <div className="dashboard-page-content">
              <p>{error || "Loading doctor dashboard..."}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { doctor, stats, todaySchedule, recentPatients } = data;

  const statsCards = [
    {
      icon: <FaCalendarCheck />,
      value: String(stats.todayAppointments),
      label: "Today’s Appointments",
      trend: "Live schedule",
    },
    {
      icon: <FaUserGroup />,
      value: String(stats.activePatients),
      label: "Active Patients",
      trend: "Real patient count",
    },
    {
      icon: <FaFileMedical />,
      value: String(stats.upcomingAppointments),
      label: "Upcoming Visits",
      trend: "Future appointments",
    },
    {
      icon: <FaStar />,
      value: String(stats.rating),
      label: "Clinic Rating",
      trend: "Patient feedback",
    },
  ];

  const quickActions = [
    {
      icon: <FaCalendarCheck />,
      title: "Review Schedule",
      text: "Check today’s live appointments and patient flow.",
      link: "/dashboard-doctor",
    },
    {
      icon: <FaFileMedical />,
      title: "Open Profile",
      text: "Update your role-based doctor profile and schedule details.",
      link: "/profile",
    },
    {
      icon: <FaRobot />,
      title: "AI Assistant",
      text: "Review symptom guidance and recommendation tools.",
      link: "/chatbot",
    },
  ];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="doctor-dashboard-page">
              <section className="doctor-dashboard-hero">
                <div className="doctor-dashboard-hero-content">
                  <div className="doctor-dashboard-badge">
                    <FaShieldHeart />
                    <span>Professional medical workspace</span>
                  </div>

                  <h1 className="doctor-dashboard-title">
                    Welcome, <span className="gradient-text">Dr. {doctor.first_name} {doctor.last_name}</span>
                  </h1>

                  <p className="doctor-dashboard-subtitle">
                    Manage your real appointments, review active patients and keep your
                    professional workflow organized from one connected dashboard.
                  </p>

                  <div className="doctor-dashboard-actions">
                    <Link to="/profile" className="primary-btn">
                      Open Profile
                      <FaArrowRight />
                    </Link>

                    <Link to="/chatbot" className="secondary-btn">
                      View AI Support
                    </Link>
                  </div>
                </div>

                <div className="doctor-dashboard-overview soft-card">
                  <div className="doctor-overview-header">
                    <span>Today Overview</span>
                    <span className="doctor-status-pill">On Duty</span>
                  </div>

                  <div className="doctor-overview-grid">
                    <div className="doctor-overview-item">
                      <strong>Clinic</strong>
                      <span>{doctor.clinic_name || "Not set"}</span>
                    </div>
                    <div className="doctor-overview-item">
                      <strong>Main Specialty</strong>
                      <span>{doctor.specialties?.split(",")[0] || "Not set"}</span>
                    </div>
                    <div className="doctor-overview-item">
                      <strong>Experience</strong>
                      <span>{doctor.experience_years || 0} years</span>
                    </div>
                    <div className="doctor-overview-item">
                      <strong>Appointments</strong>
                      <span>{stats.todayAppointments} today</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="doctor-stats-grid">
                {statsCards.map((item, index) => (
                  <article className="doctor-stat-card soft-card" key={index}>
                    <div className="doctor-stat-top">
                      <div className="icon-box">{item.icon}</div>
                      <span className="doctor-stat-trend">{item.trend}</span>
                    </div>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </article>
                ))}
              </section>

              <section className="doctor-dashboard-main">
                <div className="doctor-dashboard-left">
                  <article className="soft-card doctor-section-card">
                    <div className="doctor-section-header">
                      <div>
                        <h2>Appointments</h2>
                        <p>Your latest real appointments.</p>
                      </div>
                    </div>

                    <div className="doctor-schedule-list">
                      {todaySchedule.length === 0 && <p>No appointments available.</p>}

                      {todaySchedule.map((item) => (
                        <div className="doctor-schedule-item" key={item.id}>
                          <div className="doctor-schedule-main">
                            <div className="doctor-schedule-icon">
                              <FaUserDoctor />
                            </div>
                            <div>
                              <h3>{item.patient_first_name} {item.patient_last_name}</h3>
                              <p>{item.notes || "Medical consultation"}</p>
                              <span>{item.appointment_date} · {item.appointment_time}</span>
                            </div>
                          </div>

                          <div className={`doctor-appointment-status ${item.status.toLowerCase()}`}>
                            {item.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="soft-card doctor-section-card">
                    <div className="doctor-section-header">
                      <div>
                        <h2>Recent Patients</h2>
                        <p>Patients linked to your recent consultations.</p>
                      </div>
                    </div>

                    <div className="doctor-notes-list">
                      {recentPatients.length === 0 && <p>No patients available.</p>}

                      {recentPatients.map((item) => (
                        <div className="doctor-note-item" key={item.patient_user_id}>
                          <h3>{item.first_name} {item.last_name}</h3>
                          <p>{item.phone || "No phone available"}</p>
                          <span>Last appointment: {item.last_appointment_date}</span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="doctor-dashboard-right">
                  <article className="soft-card doctor-side-card doctor-performance-card">
                    <div className="doctor-section-header small">
                      <div>
                        <h2>Professional Snapshot</h2>
                        <p>Live professional data from your account.</p>
                      </div>
                    </div>

                    <div className="doctor-progress-ring">
                      <div className="doctor-progress-inner">
                        <strong>{stats.rating}</strong>
                        <span>Clinic rating</span>
                      </div>
                    </div>

                    <ul className="doctor-check-list">
                      <li>Appointments linked to doctor</li>
                      <li>Patients loaded from database</li>
                      <li>Profile can be edited</li>
                      <li>Schedule data available</li>
                    </ul>
                  </article>

                  <article className="soft-card doctor-side-card doctor-ai-card">
                    <div className="doctor-ai-top">
                      <div className="doctor-ai-icon">
                        <FaRobot />
                      </div>
                      <div>
                        <h2>AI Referral Insights</h2>
                        <p>Monitor symptom-based specialist suggestions.</p>
                      </div>
                    </div>

                    <div className="doctor-ai-tags">
                      <span><FaStethoscope /> Triage Support</span>
                      <span><FaUserGroup /> Patient Routing</span>
                    </div>

                    <Link to="/chatbot" className="primary-btn doctor-ai-btn">
                      Open Assistant
                      <FaArrowRight />
                    </Link>
                  </article>
                </div>
              </section>

              <section className="doctor-quick-actions-section">
                <div className="doctor-section-heading">
                  <h2 className="section-title">Quick Actions</h2>
                  <p className="section-subtitle">
                    Access the main doctor workflows from one place.
                  </p>
                </div>

                <div className="doctor-quick-actions-grid">
                  {quickActions.map((action, index) => (
                    <article className="soft-card doctor-action-card" key={index}>
                      <div className="icon-box">{action.icon}</div>
                      <h3>{action.title}</h3>
                      <p>{action.text}</p>
                      <Link to={action.link} className="doctor-inline-link">
                        Open action
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DashboardDoctor;
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
  FaCalendarDays,
  FaClock,
  FaPhone,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DashboardDoctor.css";

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return d; }
};

const formatTime = (t) => (t ? t.slice(0, 5) : "—");

function DashboardDoctor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const res = await api.get("/doctor/dashboard");
        setData(res.data);
      } catch {
        setError("Failed to load doctor dashboard.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading || !data) {
    return (
      <>
        <main className="dashboard-screen">
          <div className="page-container dashboard-shell-grid">
            <DashboardSidebar />
            <div className="dashboard-page-content">
              {error ? (
                <p style={{ color: "#b91c1c", padding: "14px 20px", background: "#fef2f2", borderRadius: 12, border: "1px solid #fecaca" }}>
                  {error}
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  {[140, 80, 200].map((h, i) => (
                    <div key={i} style={{ height: h, borderRadius: 24, opacity: 1 - i * 0.25, background: "linear-gradient(90deg,#f1f5f9 25%,#e2e8f0 50%,#f1f5f9 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.4s infinite" }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { doctor, stats, todaySchedule, recentPatients } = data;

  const statsCards = [
    { icon: <FaCalendarCheck />, value: String(stats.todayAppointments),  label: "Today's Appointments", trend: "Live schedule" },
    { icon: <FaUserGroup />,     value: String(stats.activePatients),      label: "Active Patients",     trend: "Real count" },
    { icon: <FaFileMedical />,   value: String(stats.upcomingAppointments),label: "Upcoming Visits",     trend: "Future appts" },
    { icon: <FaStar />,          value: String(stats.rating),              label: "Clinic Rating",       trend: "Patient feedback" },
  ];

  const quickActions = [
    { icon: <FaCalendarCheck />, title: "Manage Appointments", text: "Review and update your live appointments and patient schedule.", link: "/doctor/appointments" },
    { icon: <FaUserGroup />,     title: "My Patients",         text: "View all patients linked to your consultations and records.",   link: "/doctor/patients" },
    { icon: <FaFileMedical />,   title: "Open Profile",        text: "Update your doctor profile, specialties and schedule details.", link: "/profile" },
  ];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content doctor-dashboard-page">

            <section className="doctor-dashboard-hero">
              <div className="doctor-dashboard-hero-content">
                <div className="doctor-dashboard-badge">
                  <FaShieldHeart />
                  <span>Professional medical workspace</span>
                </div>

                <h1 className="doctor-dashboard-title">
                  Welcome,{" "}
                  <span className="gradient-text">
                    Dr. {doctor.first_name} {doctor.last_name}
                  </span>
                </h1>

                <p className="doctor-dashboard-subtitle">
                  Manage your appointments, review active patients and keep your
                  professional workflow organized from one connected dashboard.
                </p>

                <div className="doctor-dashboard-actions">
                  <Link to="/doctor/appointments" className="primary-btn">
                    View Appointments <FaArrowRight />
                  </Link>
                  <Link to="/doctor/patients" className="secondary-btn">
                    My Patients
                  </Link>
                </div>
              </div>

              <div className="doctor-dashboard-overview">
                <div className="doctor-overview-header">
                  <span>Today Overview</span>
                  <span className="doctor-status-pill">● On Duty</span>
                </div>
                <div className="doctor-overview-grid">
                  <div className="doctor-overview-item">
                    <strong>Clinic</strong>
                    <span>{doctor.clinic_name || "Not set"}</span>
                  </div>
                  <div className="doctor-overview-item">
                    <strong>Specialty</strong>
                    <span>{doctor.specialties?.split(",")[0]?.trim() || "Not set"}</span>
                  </div>
                  <div className="doctor-overview-item">
                    <strong>Experience</strong>
                    <span>{doctor.experience_years || 0} years</span>
                  </div>
                  <div className="doctor-overview-item">
                    <strong>Today's Visits</strong>
                    <span>{stats.todayAppointments} scheduled</span>
                  </div>
                </div>
              </div>
            </section>

            <section className="doctor-stats-grid">
              {statsCards.map((item, i) => (
                <article className="doctor-stat-card" key={i}>
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
                <article className="doctor-section-card">
                  <div className="doctor-section-header">
                    <div>
                      <h2>Appointments</h2>
                      <p>Your latest real appointments.</p>
                    </div>
                    <Link to="/doctor/appointments" className="doctor-inline-link">
                      Manage all <FaArrowRight />
                    </Link>
                  </div>

                  <div className="doctor-schedule-list">
                    {todaySchedule.length === 0 ? (
                      <div className="doctor-empty-state">No appointments scheduled.</div>
                    ) : (
                      todaySchedule.map((item) => (
                        <div className="doctor-schedule-item" key={item.id}>
                          <div className="doctor-schedule-main">
                            <div className="doctor-schedule-icon"><FaUserDoctor /></div>
                            <div>
                              <h3>{item.patient_first_name} {item.patient_last_name}</h3>
                              <p>{item.notes || "Medical consultation"}</p>
                              <span>
                                <FaCalendarDays style={{ marginRight: 4 }} />
                                {formatDate(item.appointment_date)} ·{" "}
                                <FaClock style={{ marginRight: 4 }} />
                                {formatTime(item.appointment_time)}
                              </span>
                            </div>
                          </div>
                          <div className={`doctor-appointment-status ${item.status?.toLowerCase()}`}>
                            {item.status}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="doctor-section-card">
                  <div className="doctor-section-header">
                    <div>
                      <h2>Recent Patients</h2>
                      <p>Patients from your recent consultations.</p>
                    </div>
                    <Link to="/doctor/patients" className="doctor-inline-link">
                      View all <FaArrowRight />
                    </Link>
                  </div>

                  <div className="doctor-notes-list">
                    {recentPatients.length === 0 ? (
                      <div className="doctor-empty-state">No recent patients.</div>
                    ) : (
                      recentPatients.map((item) => (
                        <div className="doctor-note-item" key={item.patient_user_id}>
                          <h3>{item.first_name} {item.last_name}</h3>
                          {item.phone && (
                            <p>
                              <FaPhone style={{ marginRight: 5, color: "#059669" }} />
                              {item.phone}
                            </p>
                          )}
                          <span>Last visit: {formatDate(item.last_appointment_date)}</span>
                        </div>
                      ))
                    )}
                  </div>
                </article>
              </div>

              <div className="doctor-dashboard-right">
                <article className="doctor-side-card doctor-performance-card">
                  <div className="doctor-section-header small">
                    <div>
                      <h2>Professional Snapshot</h2>
                      <p>Live data from your account.</p>
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
                    <li>Profile editable from sidebar</li>
                    <li>Schedule data available</li>
                  </ul>
                </article>

                <article className="doctor-side-card doctor-ai-card">
                  <div className="doctor-ai-top">
                    <div className="doctor-ai-icon"><FaRobot /></div>
                    <div>
                      <h2>AI Referral Insights</h2>
                      <p>Symptom-based specialist suggestions.</p>
                    </div>
                  </div>

                  <div className="doctor-ai-tags">
                    <span><FaStethoscope /> Triage Support</span>
                    <span><FaUserGroup /> Patient Routing</span>
                  </div>

                  <Link to="/chatbot" className="primary-btn doctor-ai-btn">
                    Open Assistant <FaArrowRight />
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
                {quickActions.map((action, i) => (
                  <article className="doctor-action-card" key={i}>
                    <div className="icon-box">{action.icon}</div>
                    <h3>{action.title}</h3>
                    <p>{action.text}</p>
                    <Link to={action.link} className="doctor-inline-link">
                      Open action <FaArrowRight />
                    </Link>
                  </article>
                ))}
              </div>
            </section>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default DashboardDoctor;
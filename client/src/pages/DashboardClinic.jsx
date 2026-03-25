import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaChartLine,
  FaHospital,
  FaShieldHeart,
  FaStar,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/DashboardClinic.css";

function DashboardClinic() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/clinic/dashboard");
        setData(response.data);
      } catch (err) {
        setError("Failed to load clinic dashboard.");
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
              <p>{error || "Loading clinic dashboard..."}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { clinic, stats, doctors, bookings } = data;

  const statsCards = [
    {
      icon: <FaCalendarCheck />,
      value: String(stats.weeklyAppointments),
      label: "Weekly Appointments",
      trend: "Current week",
    },
    {
      icon: <FaUserDoctor />,
      value: String(stats.doctorsCount),
      label: "Doctors in Clinic",
      trend: "Real linked doctors",
    },
    {
      icon: <FaStethoscope />,
      value: String(stats.specialtiesCount),
      label: "Active Specialties",
      trend: "Distinct specialties",
    },
    {
      icon: <FaStar />,
      value: String(stats.rating),
      label: "Clinic Rating",
      trend: "Patient feedback",
    },
  ];

  const actions = [
    {
      icon: <FaUserDoctor />,
      title: "Create Doctor",
      text: "Add a doctor account assigned automatically to your clinic.",
      link: "/clinic/create-doctor",
    },
    {
      icon: <FaHospital />,
      title: "Open Profile",
      text: "Update your clinic profile details and public information.",
      link: "/profile",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Review Bookings",
      text: "See the latest appointments created for your clinic.",
      link: "/dashboard-clinic",
    },
  ];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="clinic-dashboard-page">
              <section className="clinic-dashboard-hero">
                <div className="clinic-dashboard-hero-content">
                  <div className="clinic-dashboard-badge">
                    <FaShieldHeart />
                    <span>Clinic management workspace</span>
                  </div>

                  <h1 className="clinic-dashboard-title">
                    Manage <span className="gradient-text">{clinic.name}</span>
                  </h1>

                  <p className="clinic-dashboard-subtitle">
                    Organize doctors, review real bookings and manage clinic data from
                    a connected role-based dashboard.
                  </p>

                  <div className="clinic-dashboard-actions">
                    <Link to="/clinic/create-doctor" className="primary-btn">
                      Create Doctor
                      <FaArrowRight />
                    </Link>

                    <Link to="/profile" className="secondary-btn">
                      View Profile
                    </Link>
                  </div>
                </div>

                <div className="clinic-dashboard-overview soft-card">
                  <div className="clinic-overview-header">
                    <span>Clinic Summary</span>
                    <span className="clinic-status-pill">Operational</span>
                  </div>

                  <div className="clinic-overview-grid">
                    <div className="clinic-overview-item">
                      <strong>Clinic</strong>
                      <span>{clinic.name}</span>
                    </div>
                    <div className="clinic-overview-item">
                      <strong>City</strong>
                      <span>{clinic.city || "Not set"}</span>
                    </div>
                    <div className="clinic-overview-item">
                      <strong>Type</strong>
                      <span>{clinic.clinic_type}</span>
                    </div>
                    <div className="clinic-overview-item">
                      <strong>Doctors</strong>
                      <span>{stats.doctorsCount}</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="clinic-stats-grid">
                {statsCards.map((item, index) => (
                  <article className="clinic-stat-card soft-card" key={index}>
                    <div className="clinic-stat-top">
                      <div className="icon-box">{item.icon}</div>
                      <span className="clinic-stat-trend">{item.trend}</span>
                    </div>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </article>
                ))}
              </section>

              <section className="clinic-dashboard-main">
                <div className="clinic-dashboard-left">
                  <article className="soft-card clinic-section-card-dashboard">
                    <div className="clinic-section-header-dashboard">
                      <div>
                        <h2>Doctors Overview</h2>
                        <p>Doctors linked to your clinic from live data.</p>
                      </div>
                    </div>

                    <div className="clinic-doctors-dashboard-list">
                      {doctors.length === 0 && <p>No doctors available yet.</p>}

                      {doctors.map((doctor) => (
                        <div className="clinic-doctor-dashboard-item" key={doctor.id}>
                          <div className="clinic-doctor-dashboard-main">
                            <div className="clinic-doctor-dashboard-icon">
                              <FaUserDoctor />
                            </div>
                            <div>
                              <h3>{doctor.first_name} {doctor.last_name}</h3>
                              <p>{doctor.specialties || "No specialties assigned"}</p>
                            </div>
                          </div>
                          <div className={`clinic-doctor-status ${doctor.status.toLowerCase()}`}>
                            {doctor.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="soft-card clinic-section-card-dashboard">
                    <div className="clinic-section-header-dashboard">
                      <div>
                        <h2>Recent Bookings</h2>
                        <p>Latest appointments created for this clinic.</p>
                      </div>
                    </div>

                    <div className="clinic-bookings-list">
                      {bookings.length === 0 && <p>No bookings available yet.</p>}

                      {bookings.map((booking) => (
                        <div className="clinic-booking-item" key={booking.id}>
                          <h3>{booking.patient_first_name} {booking.patient_last_name}</h3>
                          <p>Dr. {booking.doctor_first_name} {booking.doctor_last_name}</p>
                          <span>{booking.appointment_date} · {booking.appointment_time}</span>
                          <div className={`clinic-booking-status ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="clinic-dashboard-right">
                  <article className="soft-card clinic-side-card-dashboard clinic-growth-card">
                    <div className="clinic-section-header-dashboard small">
                      <div>
                        <h2>Growth Snapshot</h2>
                        <p>Operational performance indicators.</p>
                      </div>
                    </div>

                    <div className="clinic-growth-ring">
                      <div className="clinic-growth-inner">
                        <strong>{stats.rating}</strong>
                        <span>Clinic rating</span>
                      </div>
                    </div>

                    <ul className="clinic-check-list">
                      <li>Appointments loaded from DB</li>
                      <li>Doctors linked to clinic</li>
                      <li>Specialties counted live</li>
                      <li>Profile available for editing</li>
                    </ul>
                  </article>

                  <article className="soft-card clinic-side-card-dashboard clinic-brand-card">
                    <div className="clinic-brand-top">
                      <div className="clinic-brand-icon">
                        <FaHospital />
                      </div>
                      <div>
                        <h2>Clinic Reputation</h2>
                        <p>Public profile and patient trust.</p>
                      </div>
                    </div>

                    <div className="clinic-brand-tags">
                      <span><FaChartLine /> Live Metrics</span>
                      <span><FaUserDoctor /> Real Doctors</span>
                    </div>

                    <Link to={`/clinics/${clinic.id}`} className="primary-btn clinic-brand-btn">
                      View Public Page
                      <FaArrowRight />
                    </Link>
                  </article>
                </div>
              </section>

              <section className="clinic-actions-section">
                <div className="clinic-section-heading-dashboard">
                  <h2 className="section-title">Quick Management Actions</h2>
                  <p className="section-subtitle">
                    Handle the most important clinic workflows quickly.
                  </p>
                </div>

                <div className="clinic-actions-grid-dashboard">
                  {actions.map((action, index) => (
                    <article className="soft-card clinic-action-card" key={index}>
                      <div className="icon-box">{action.icon}</div>
                      <h3>{action.title}</h3>
                      <p>{action.text}</p>
                      <Link to={action.link} className="clinic-inline-link-dashboard">
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

export default DashboardClinic;
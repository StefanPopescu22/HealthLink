import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartLine,
  FaClipboardCheck,
  FaHospital,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
  FaUserGroup,
  FaUserShield,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/AdminPanel.css";

function AdminPanel() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard");
        setData(response.data);
      } catch (err) {
        setError("Failed to load admin dashboard.");
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
              <p>{error || "Loading admin dashboard..."}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { stats, latestClinics, latestDoctors, usersByRole } = data;

  const statsCards = [
    {
      icon: <FaUserGroup />,
      value: String(stats.registeredUsers),
      label: "Registered Users",
      trend: "Live total",
    },
    {
      icon: <FaHospital />,
      value: String(stats.clinicsCount),
      label: "Clinics in Platform",
      trend: "Real clinics",
    },
    {
      icon: <FaUserDoctor />,
      value: String(stats.doctorsCount),
      label: "Doctors Registered",
      trend: "Live doctor count",
    },
    {
      icon: <FaStar />,
      value: String(stats.avgRating),
      label: "Average Platform Rating",
      trend: "From reviews",
    },
  ];

  const actions = [
    {
      icon: <FaClipboardCheck />,
      title: "Create Clinic",
      text: "Create a new clinic account and its platform profile.",
      link: "/admin/create-clinic",
    },
    {
      icon: <FaUserShield />,
      title: "Create Doctor",
      text: "Create doctor accounts and assign them to clinics.",
      link: "/admin/create-doctor",
    },
    {
      icon: <FaChartLine />,
      title: "Review Platform",
      text: "Monitor the live statistics of the healthcare platform.",
      link: "/admin",
    },
  ];

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="admin-page">
              <section className="admin-hero">
                <div className="admin-hero-content">
                  <div className="admin-badge">
                    <FaShieldHeart />
                    <span>Administrative control center</span>
                  </div>

                  <h1 className="admin-title">
                    Platform <span className="gradient-text">Administration Panel</span>
                  </h1>

                  <p className="admin-subtitle">
                    Review real platform metrics, recent clinics and recent doctors from one centralized management interface.
                  </p>

                  <div className="admin-actions">
                    <Link to="/admin/create-clinic" className="primary-btn">
                      Open Controls
                      <FaArrowRight />
                    </Link>

                    <Link to="/admin/create-doctor" className="secondary-btn">
                      Open Moderation
                    </Link>
                  </div>
                </div>

                <div className="admin-overview soft-card">
                  <div className="admin-overview-header">
                    <span>System Status</span>
                    <span className="admin-status-pill">Stable</span>
                  </div>

                  <div className="admin-overview-grid">
                    {usersByRole.map((item) => (
                      <div className="admin-overview-item" key={item.role}>
                        <strong>{item.role}</strong>
                        <span>{item.total} accounts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="admin-stats-grid">
                {statsCards.map((item, index) => (
                  <article className="admin-stat-card soft-card" key={index}>
                    <div className="admin-stat-top">
                      <div className="icon-box">{item.icon}</div>
                      <span className="admin-stat-trend">{item.trend}</span>
                    </div>
                    <h3>{item.value}</h3>
                    <p>{item.label}</p>
                  </article>
                ))}
              </section>

              <section className="admin-main">
                <div className="admin-left">
                  <article className="soft-card admin-section-card">
                    <div className="admin-section-header">
                      <div>
                        <h2>Latest Clinics</h2>
                        <p>Most recent clinics created on the platform.</p>
                      </div>
                    </div>

                    <div className="admin-approval-list">
                      {latestClinics.length === 0 && <p>No clinics available yet.</p>}

                      {latestClinics.map((item) => (
                        <div className="admin-approval-item" key={item.id}>
                          <div>
                            <h3>{item.name}</h3>
                            <p>{item.city || "City not set"}</p>
                          </div>
                          <div className="admin-pill warning">
                            {item.approved ? "Approved" : "Pending"}
                          </div>
                        </div>
                      ))}
                    </div>
                  </article>

                  <article className="soft-card admin-section-card">
                    <div className="admin-section-header">
                      <div>
                        <h2>Latest Doctors</h2>
                        <p>Most recent doctors created on the platform.</p>
                      </div>
                    </div>

                    <div className="admin-moderation-list">
                      {latestDoctors.length === 0 && <p>No doctors available yet.</p>}

                      {latestDoctors.map((item) => (
                        <div className="admin-moderation-item" key={item.id}>
                          <h3>{item.first_name} {item.last_name}</h3>
                          <p>{item.clinic_name}</p>
                          <span className="admin-priority low">
                            {item.experience_years || 0} years experience
                          </span>
                        </div>
                      ))}
                    </div>
                  </article>
                </div>

                <div className="admin-right">
                  <article className="soft-card admin-side-card admin-system-card">
                    <div className="admin-section-header small">
                      <div>
                        <h2>System Control</h2>
                        <p>Platform governance and monitoring.</p>
                      </div>
                    </div>

                    <div className="admin-progress-ring">
                      <div className="admin-progress-inner">
                        <strong>{stats.avgRating}</strong>
                        <span>Average rating</span>
                      </div>
                    </div>

                    <ul className="admin-check-list">
                      <li>Real user count loaded</li>
                      <li>Real clinics loaded</li>
                      <li>Real doctors loaded</li>
                      <li>Platform overview active</li>
                    </ul>
                  </article>

                  <article className="soft-card admin-side-card admin-security-card">
                    <div className="admin-security-top">
                      <div className="admin-security-icon">
                        <FaUserShield />
                      </div>
                      <div>
                        <h2>Governance Tools</h2>
                        <p>Role control and account creation flows.</p>
                      </div>
                    </div>

                    <div className="admin-security-tags">
                      <span><FaUserGroup /> Role Review</span>
                      <span><FaClipboardCheck /> Account Creation</span>
                    </div>

                    <Link to="/admin/create-doctor" className="primary-btn admin-security-btn">
                      Open Moderation
                      <FaArrowRight />
                    </Link>
                  </article>
                </div>
              </section>

              <section className="admin-actions-section">
                <div className="admin-section-heading">
                  <h2 className="section-title">Quick Administrative Actions</h2>
                  <p className="section-subtitle">
                    Handle critical platform tasks from a unified control space.
                  </p>
                </div>

                <div className="admin-actions-grid">
                  {actions.map((action, index) => (
                    <article className="soft-card admin-action-card" key={index}>
                      <div className="icon-box">{action.icon}</div>
                      <h3>{action.title}</h3>
                      <p>{action.text}</p>
                      <Link to={action.link} className="admin-inline-link">
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

export default AdminPanel;
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
import Footer from "../components/Footer";
import "../styles/AdminPanel.css";

function AdminPanel() {
  const stats = [
    {
      icon: <FaUserGroup />,
      value: "1,248",
      label: "Registered Users",
      trend: "+86 this month",
    },
    {
      icon: <FaHospital />,
      value: "72",
      label: "Clinics in Platform",
      trend: "5 awaiting approval",
    },
    {
      icon: <FaUserDoctor />,
      value: "218",
      label: "Doctors Registered",
      trend: "12 new entries",
    },
    {
      icon: <FaStar />,
      value: "4.8",
      label: "Average Platform Rating",
      trend: "Positive trend",
    },
  ];

  const approvals = [
    { clinic: "NorthCare Medical Center", city: "Bucharest", status: "Pending Approval" },
    { clinic: "Prime Women Health", city: "Cluj-Napoca", status: "Pending Approval" },
    { clinic: "Bright Dental Studio", city: "Iași", status: "Pending Approval" },
  ];

  const moderation = [
    { item: "Clinic review flagged for verification", area: "Reviews", priority: "High" },
    { item: "Doctor profile details missing validation", area: "Doctors", priority: "Medium" },
    { item: "Service category requires mapping", area: "Services", priority: "Low" },
  ];

  const actions = [
    {
      icon: <FaClipboardCheck />,
      title: "Approve Clinics",
      text: "Review pending medical providers and validate platform listings.",
      link: "/admin",
    },
    {
      icon: <FaUserShield />,
      title: "Manage Users",
      text: "Block, review or inspect users across patient, doctor and clinic roles.",
      link: "/admin",
    },
    {
      icon: <FaChartLine />,
      title: "Monitor System",
      text: "Track platform health, engagement and moderation metrics.",
      link: "/admin",
    },
  ];

  return (
    <>
      <main className="admin-page">
        <div className="page-container">
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
                Oversee users, clinics, approvals, moderation and key health platform
                indicators from one centralized management interface.
              </p>

              <div className="admin-actions">
                <Link to="/admin" className="primary-btn">
                  Open Controls
                  <FaArrowRight />
                </Link>

                <Link to="/clinics" className="secondary-btn">
                  View Public Platform
                </Link>
              </div>
            </div>

            <div className="admin-overview soft-card">
              <div className="admin-overview-header">
                <span>System Status</span>
                <span className="admin-status-pill">Stable</span>
              </div>

              <div className="admin-overview-grid">
                <div className="admin-overview-item">
                  <strong>Pending Approvals</strong>
                  <span>5 clinics</span>
                </div>
                <div className="admin-overview-item">
                  <strong>Flagged Reviews</strong>
                  <span>3 items</span>
                </div>
                <div className="admin-overview-item">
                  <strong>System Health</strong>
                  <span>98% uptime</span>
                </div>
                <div className="admin-overview-item">
                  <strong>Moderation Queue</strong>
                  <span>Active</span>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-stats-grid">
            {stats.map((item, index) => (
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
                    <h2>Clinic Approval Queue</h2>
                    <p>Medical providers waiting for validation.</p>
                  </div>
                </div>

                <div className="admin-approval-list">
                  {approvals.map((item, index) => (
                    <div className="admin-approval-item" key={index}>
                      <div>
                        <h3>{item.clinic}</h3>
                        <p>{item.city}</p>
                      </div>
                      <div className="admin-pill warning">{item.status}</div>
                    </div>
                  ))}
                </div>
              </article>

              <article className="soft-card admin-section-card">
                <div className="admin-section-header">
                  <div>
                    <h2>Moderation Queue</h2>
                    <p>Items requiring review from the admin team.</p>
                  </div>
                </div>

                <div className="admin-moderation-list">
                  {moderation.map((item, index) => (
                    <div className="admin-moderation-item" key={index}>
                      <h3>{item.item}</h3>
                      <p>{item.area}</p>
                      <span className={`admin-priority ${item.priority.toLowerCase()}`}>
                        {item.priority}
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
                    <strong>98%</strong>
                    <span>Platform stability</span>
                  </div>
                </div>

                <ul className="admin-check-list">
                  <li>Approvals monitored</li>
                  <li>Moderation active</li>
                  <li>Roles validated</li>
                  <li>Analytics available</li>
                </ul>
              </article>

              <article className="soft-card admin-side-card admin-security-card">
                <div className="admin-security-top">
                  <div className="admin-security-icon">
                    <FaUserShield />
                  </div>
                  <div>
                    <h2>Governance Tools</h2>
                    <p>Role control, moderation and trust signals.</p>
                  </div>
                </div>

                <div className="admin-security-tags">
                  <span><FaUserGroup /> Role Review</span>
                  <span><FaClipboardCheck /> Clinic Validation</span>
                </div>

                <Link to="/admin" className="primary-btn admin-security-btn">
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
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminPanel;
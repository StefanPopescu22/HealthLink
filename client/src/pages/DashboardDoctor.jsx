import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaChartLine,
  FaClock,
  FaFileMedical,
  FaRobot,
  FaShieldHeart,
  FaStar,
  FaStethoscope,
  FaUserDoctor,
  FaUserGroup,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/DashboardDoctor.css";

function DashboardDoctor() {
  const stats = [
    {
      icon: <FaCalendarCheck />,
      value: "08",
      label: "Today’s Appointments",
      trend: "2 upcoming soon",
    },
    {
      icon: <FaUserGroup />,
      value: "34",
      label: "Active Patients",
      trend: "6 new this week",
    },
    {
      icon: <FaFileMedical />,
      value: "15",
      label: "Medical Notes",
      trend: "4 pending updates",
    },
    {
      icon: <FaStar />,
      value: "4.9",
      label: "Average Rating",
      trend: "Excellent feedback",
    },
  ];

  const todaySchedule = [
    {
      patient: "Maria Ionescu",
      reason: "Cardiology Follow-up",
      time: "09:30 AM",
      status: "Confirmed",
    },
    {
      patient: "Alex Popescu",
      reason: "Chest Pain Evaluation",
      time: "11:00 AM",
      status: "Confirmed",
    },
    {
      patient: "Ioana Radu",
      reason: "Preventive Consultation",
      time: "02:30 PM",
      status: "Pending",
    },
  ];

  const recentPatients = [
    {
      name: "Victor Matei",
      note: "Blood pressure monitoring recommended for 14 days.",
      updated: "Updated 2 hours ago",
    },
    {
      name: "Elena Stan",
      note: "Requested dermatology referral after symptom review.",
      updated: "Updated yesterday",
    },
  ];

  const quickActions = [
    {
      icon: <FaCalendarCheck />,
      title: "Manage Schedule",
      text: "Review today’s appointments and confirm upcoming consultations.",
      link: "/dashboard-doctor",
    },
    {
      icon: <FaFileMedical />,
      title: "Write Medical Notes",
      text: "Add recommendations, observations and structured follow-up notes.",
      link: "/dashboard-doctor",
    },
    {
      icon: <FaRobot />,
      title: "Review AI Guidance",
      text: "See how AI-assisted patient navigation aligns with specialist referrals.",
      link: "/chatbot",
    },
  ];

  return (
    <>
      <main className="doctor-dashboard-page">
        <div className="page-container">
          <section className="doctor-dashboard-hero">
            <div className="doctor-dashboard-hero-content">
              <div className="doctor-dashboard-badge">
                <FaShieldHeart />
                <span>Professional medical workspace</span>
              </div>

              <h1 className="doctor-dashboard-title">
                Welcome to your <span className="gradient-text">Doctor Dashboard</span>
              </h1>

              <p className="doctor-dashboard-subtitle">
                Manage appointments, review patients, add observations and keep your
                clinical workflow structured through a modern healthcare interface.
              </p>

              <div className="doctor-dashboard-actions">
                <Link to="/dashboard-doctor" className="primary-btn">
                  Open Schedule
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
                  <strong>Next Appointment</strong>
                  <span>09:30 AM</span>
                </div>
                <div className="doctor-overview-item">
                  <strong>Main Specialty</strong>
                  <span>Cardiology</span>
                </div>
                <div className="doctor-overview-item">
                  <strong>Open Notes</strong>
                  <span>4 pending</span>
                </div>
                <div className="doctor-overview-item">
                  <strong>Clinic</strong>
                  <span>MedFuture Clinic</span>
                </div>
              </div>
            </div>
          </section>

          <section className="doctor-stats-grid">
            {stats.map((item, index) => (
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
                    <h2>Today’s Schedule</h2>
                    <p>Your active medical consultations for the day.</p>
                  </div>
                </div>

                <div className="doctor-schedule-list">
                  {todaySchedule.map((item, index) => (
                    <div className="doctor-schedule-item" key={index}>
                      <div className="doctor-schedule-main">
                        <div className="doctor-schedule-icon">
                          <FaUserDoctor />
                        </div>
                        <div>
                          <h3>{item.patient}</h3>
                          <p>{item.reason}</p>
                          <span>
                            <FaClock /> {item.time}
                          </span>
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
                    <h2>Recent Patient Notes</h2>
                    <p>Recently updated observations and recommendations.</p>
                  </div>
                </div>

                <div className="doctor-notes-list">
                  {recentPatients.map((item, index) => (
                    <div className="doctor-note-item" key={index}>
                      <h3>{item.name}</h3>
                      <p>{item.note}</p>
                      <span>{item.updated}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="doctor-dashboard-right">
              <article className="soft-card doctor-side-card doctor-performance-card">
                <div className="doctor-section-header small">
                  <div>
                    <h2>Performance Snapshot</h2>
                    <p>Professional activity at a glance.</p>
                  </div>
                </div>

                <div className="doctor-progress-ring">
                  <div className="doctor-progress-inner">
                    <strong>91%</strong>
                    <span>Schedule completion</span>
                  </div>
                </div>

                <ul className="doctor-check-list">
                  <li>Appointments reviewed</li>
                  <li>Patient notes updated</li>
                  <li>Follow-ups scheduled</li>
                  <li>2 pending confirmations</li>
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
                  <span><FaChartLine /> Better Routing</span>
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
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DashboardDoctor;
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
  FaUserGroup,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/DashboardClinic.css";

function DashboardClinic() {
  const stats = [
    {
      icon: <FaCalendarCheck />,
      value: "46",
      label: "Weekly Appointments",
      trend: "+12% vs last week",
    },
    {
      icon: <FaUserDoctor />,
      value: "24",
      label: "Doctors in Clinic",
      trend: "3 recently added",
    },
    {
      icon: <FaStethoscope />,
      value: "18",
      label: "Medical Services",
      trend: "2 updated today",
    },
    {
      icon: <FaStar />,
      value: "4.8",
      label: "Clinic Rating",
      trend: "High patient trust",
    },
  ];

  const doctors = [
    { name: "Dr. Elena Popescu", specialty: "Cardiology", status: "Available" },
    { name: "Dr. Andrei Marinescu", specialty: "Internal Medicine", status: "Busy" },
    { name: "Dr. Ioana Petrescu", specialty: "Dermatology", status: "Available" },
  ];

  const bookings = [
    { patient: "Maria Ionescu", doctor: "Dr. Elena Popescu", date: "March 28, 2026", status: "Confirmed" },
    { patient: "Alex Popescu", doctor: "Dr. Andrei Marinescu", date: "March 28, 2026", status: "Pending" },
  ];

  const actions = [
    {
      icon: <FaUserDoctor />,
      title: "Manage Doctors",
      text: "Add, edit and organize specialists available in the clinic.",
      link: "/dashboard-clinic",
    },
    {
      icon: <FaStethoscope />,
      title: "Manage Services",
      text: "Update consultation types, specialties and medical service information.",
      link: "/dashboard-clinic",
    },
    {
      icon: <FaCalendarCheck />,
      title: "Review Bookings",
      text: "Confirm, cancel or coordinate patient appointments efficiently.",
      link: "/dashboard-clinic",
    },
  ];

  return (
    <>
      <main className="clinic-dashboard-page">
        <div className="page-container">
          <section className="clinic-dashboard-hero">
            <div className="clinic-dashboard-hero-content">
              <div className="clinic-dashboard-badge">
                <FaShieldHeart />
                <span>Clinic management workspace</span>
              </div>

              <h1 className="clinic-dashboard-title">
                Manage your <span className="gradient-text">Clinic Operations</span>
              </h1>

              <p className="clinic-dashboard-subtitle">
                Organize doctors, appointments, services and patient interactions through
                a connected digital dashboard built for modern medical providers.
              </p>

              <div className="clinic-dashboard-actions">
                <Link to="/dashboard-clinic" className="primary-btn">
                  Open Management
                  <FaArrowRight />
                </Link>

                <Link to="/clinics" className="secondary-btn">
                  View Public Profile
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
                  <span>MedFuture Clinic</span>
                </div>
                <div className="clinic-overview-item">
                  <strong>Main City</strong>
                  <span>Bucharest</span>
                </div>
                <div className="clinic-overview-item">
                  <strong>Open Requests</strong>
                  <span>5 pending</span>
                </div>
                <div className="clinic-overview-item">
                  <strong>Today Capacity</strong>
                  <span>78% booked</span>
                </div>
              </div>
            </div>
          </section>

          <section className="clinic-stats-grid">
            {stats.map((item, index) => (
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
                    <p>Current specialists available in the clinic.</p>
                  </div>
                </div>

                <div className="clinic-doctors-dashboard-list">
                  {doctors.map((doctor, index) => (
                    <div className="clinic-doctor-dashboard-item" key={index}>
                      <div className="clinic-doctor-dashboard-main">
                        <div className="clinic-doctor-dashboard-icon">
                          <FaUserDoctor />
                        </div>
                        <div>
                          <h3>{doctor.name}</h3>
                          <p>{doctor.specialty}</p>
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
                    <p>Latest appointment requests and confirmations.</p>
                  </div>
                </div>

                <div className="clinic-bookings-list">
                  {bookings.map((booking, index) => (
                    <div className="clinic-booking-item" key={index}>
                      <h3>{booking.patient}</h3>
                      <p>{booking.doctor}</p>
                      <span>{booking.date}</span>
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
                    <strong>84%</strong>
                    <span>Capacity usage</span>
                  </div>
                </div>

                <ul className="clinic-check-list">
                  <li>Appointments reviewed</li>
                  <li>Doctors coordinated</li>
                  <li>Services updated</li>
                  <li>1 review requires response</li>
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
                  <span><FaChartLine /> Strong Visibility</span>
                  <span><FaUserGroup /> Patient Retention</span>
                </div>

                <Link to="/clinic-profile" className="primary-btn clinic-brand-btn">
                  View Clinic Page
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
        </div>
      </main>

      <Footer />
    </>
  );
}

export default DashboardClinic;
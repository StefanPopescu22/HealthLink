import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClock,
  FaFilter,
  FaLocationDot,
  FaShieldHeart,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/Appointments.css";

function Appointments() {
  const upcomingAppointments = [
    {
      doctor: "Dr. Elena Popescu",
      specialty: "Cardiology Consultation",
      clinic: "MedFuture Clinic",
      date: "March 28, 2026",
      time: "10:30 AM",
      status: "Confirmed",
    },
    {
      doctor: "Dr. Andrei Marinescu",
      specialty: "Dermatology Follow-up",
      clinic: "LifeCare Medical Hub",
      date: "April 02, 2026",
      time: "02:15 PM",
      status: "Pending",
    },
  ];

  const historyAppointments = [
    {
      doctor: "Dr. Ioana Petrescu",
      specialty: "General Check-up",
      clinic: "Urban Care Clinic",
      date: "February 16, 2026",
      time: "11:00 AM",
      status: "Completed",
    },
    {
      doctor: "Dr. Victor Stan",
      specialty: "Internal Medicine",
      clinic: "Prime Diagnostic House",
      date: "January 22, 2026",
      time: "09:45 AM",
      status: "Completed",
    },
  ];

  return (
    <>
      <main className="appointments-page">
        <div className="page-container">
          <section className="appointments-hero">
            <div className="appointments-hero-content">
              <div className="appointments-badge">
                <FaShieldHeart />
                <span>Structured appointment management</span>
              </div>

              <h1 className="appointments-title">
                Manage your <span className="gradient-text">medical appointments</span>
              </h1>

              <p className="appointments-subtitle">
                View upcoming visits, review appointment history and keep your healthcare
                schedule organized in one modern patient workspace.
              </p>

              <div className="appointments-actions">
                <Link to="/clinics" className="primary-btn">
                  Book New Appointment
                  <FaArrowRight />
                </Link>

                <Link to="/dashboard-patient" className="secondary-btn">
                  Back to Dashboard
                </Link>
              </div>
            </div>

            <div className="appointments-side-card soft-card">
              <div className="appointments-side-header">
                <span>Appointments Summary</span>
                <span className="appointments-side-pill">Updated</span>
              </div>

              <div className="appointments-side-grid">
                <div className="appointments-side-item">
                  <strong>Upcoming</strong>
                  <span>2 scheduled visits</span>
                </div>
                <div className="appointments-side-item">
                  <strong>Completed</strong>
                  <span>12 past consultations</span>
                </div>
                <div className="appointments-side-item">
                  <strong>Next Visit</strong>
                  <span>March 28, 2026</span>
                </div>
                <div className="appointments-side-item">
                  <strong>Active Clinic</strong>
                  <span>MedFuture Clinic</span>
                </div>
              </div>
            </div>
          </section>

          <section className="appointments-filter-row">
            <button className="appointments-filter active">
              <FaFilter />
              <span>All</span>
            </button>
            <button className="appointments-filter">Upcoming</button>
            <button className="appointments-filter">Pending</button>
            <button className="appointments-filter">Completed</button>
            <button className="appointments-filter">Cancelled</button>
          </section>

          <section className="appointments-content">
            <div className="appointments-column">
              <div className="appointments-section-heading">
                <h2>Upcoming Appointments</h2>
                <p>Your next scheduled medical visits.</p>
              </div>

              <div className="appointments-list">
                {upcomingAppointments.map((item, index) => (
                  <article className="soft-card appointment-card" key={index}>
                    <div className="appointment-main">
                      <div className="appointment-icon">
                        <FaUserDoctor />
                      </div>

                      <div className="appointment-content">
                        <h3>{item.doctor}</h3>
                        <p>{item.specialty}</p>

                        <div className="appointment-meta">
                          <span>
                            <FaLocationDot />
                            {item.clinic}
                          </span>
                          <span>
                            <FaCalendarCheck />
                            {item.date}
                          </span>
                          <span>
                            <FaClock />
                            {item.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`appointment-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <div className="appointments-column">
              <div className="appointments-section-heading">
                <h2>Appointment History</h2>
                <p>Your recent completed consultations.</p>
              </div>

              <div className="appointments-list">
                {historyAppointments.map((item, index) => (
                  <article className="soft-card appointment-card" key={index}>
                    <div className="appointment-main">
                      <div className="appointment-icon">
                        <FaUserDoctor />
                      </div>

                      <div className="appointment-content">
                        <h3>{item.doctor}</h3>
                        <p>{item.specialty}</p>

                        <div className="appointment-meta">
                          <span>
                            <FaLocationDot />
                            {item.clinic}
                          </span>
                          <span>
                            <FaCalendarCheck />
                            {item.date}
                          </span>
                          <span>
                            <FaClock />
                            {item.time}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className={`appointment-status ${item.status.toLowerCase()}`}>
                      {item.status}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Appointments;
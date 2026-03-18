import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClock,
  FaEnvelope,
  FaHospital,
  FaLocationDot,
  FaPhone,
  FaShieldHeart,
  FaStar,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/ClinicProfile.css";

function ClinicProfile() {
  const services = [
    "Cardiology Consultation",
    "Internal Medicine",
    "ECG & Heart Monitoring",
    "Blood Tests",
    "Dermatology Evaluation",
    "Preventive Check-ups",
  ];

  const doctors = [
    {
      name: "Dr. Elena Popescu",
      specialty: "Cardiology",
      experience: "12 years experience",
      rating: "4.9",
    },
    {
      name: "Dr. Andrei Marinescu",
      specialty: "Internal Medicine",
      experience: "9 years experience",
      rating: "4.8",
    },
    {
      name: "Dr. Ioana Petrescu",
      specialty: "Dermatology",
      experience: "10 years experience",
      rating: "4.9",
    },
  ];

  const reviews = [
    {
      name: "Maria Ionescu",
      text: "Very modern clinic, fast appointment flow and clear communication from the staff.",
      rating: "5.0",
    },
    {
      name: "Alex Pop",
      text: "Professional doctors, clean environment and a smooth digital patient experience.",
      rating: "4.8",
    },
  ];

  return (
    <>
      <main className="clinic-profile-page">
        <div className="page-container">
          <section className="clinic-profile-hero soft-card">
            <div className="clinic-profile-main">
              <div className="clinic-profile-badge">
                <FaShieldHeart />
                <span>Verified Medical Provider</span>
              </div>

              <div className="clinic-profile-title-row">
                <div className="clinic-profile-icon">
                  <FaHospital />
                </div>

                <div>
                  <h1>MedFuture Clinic</h1>
                  <p>Cardiology · Internal Medicine · Diagnostics</p>
                </div>
              </div>

              <div className="clinic-profile-meta">
                <span>
                  <FaLocationDot />
                  Bucharest, Romania
                </span>
                <span>
                  <FaStar />
                  4.9 rating
                </span>
                <span>
                  <FaUserDoctor />
                  24 doctors
                </span>
              </div>

              <p className="clinic-profile-description">
                MedFuture Clinic is a modern healthcare center focused on specialist care,
                diagnostics and integrated digital services. Patients can book visits,
                manage medical documents and receive coordinated treatment support in one place.
              </p>

              <div className="clinic-profile-actions">
                <Link to="/dashboard-patient" className="primary-btn">
                  Book Appointment
                  <FaCalendarCheck />
                </Link>

                <Link to="/clinics" className="secondary-btn">
                  Back to Clinics
                </Link>
              </div>
            </div>

            <div className="clinic-profile-side">
              <div className="clinic-side-card">
                <h3>Contact Information</h3>
                <ul>
                  <li>
                    <FaPhone />
                    <span>+40 700 111 222</span>
                  </li>
                  <li>
                    <FaEnvelope />
                    <span>contact@medfutureclinic.ro</span>
                  </li>
                  <li>
                    <FaClock />
                    <span>Mon - Fri · 08:00 - 18:00</span>
                  </li>
                </ul>
              </div>

              <div className="clinic-side-card">
                <h3>Platform Highlights</h3>
                <div className="clinic-highlight-item">
                  <strong>Fast Booking</strong>
                  <span>Real-time appointment flow</span>
                </div>
                <div className="clinic-highlight-item">
                  <strong>Digital Records</strong>
                  <span>Documents and analyses in one place</span>
                </div>
                <div className="clinic-highlight-item">
                  <strong>AI Guidance</strong>
                  <span>Symptom-based specialty suggestions</span>
                </div>
              </div>
            </div>
          </section>

          <section className="clinic-profile-content">
            <div className="clinic-profile-left">
              <article className="soft-card clinic-section-card">
                <div className="clinic-section-header">
                  <div>
                    <h2>Medical Services</h2>
                    <p>Specialties and services currently available at this clinic.</p>
                  </div>
                </div>

                <div className="clinic-services-grid">
                  {services.map((service, index) => (
                    <div className="clinic-service-pill" key={index}>
                      <FaStethoscope />
                      <span>{service}</span>
                    </div>
                  ))}
                </div>
              </article>

              <article className="soft-card clinic-section-card">
                <div className="clinic-section-header">
                  <div>
                    <h2>Doctors in This Clinic</h2>
                    <p>Meet the specialists available for booking.</p>
                  </div>
                </div>

                <div className="clinic-doctors-list">
                  {doctors.map((doctor, index) => (
                    <div className="clinic-doctor-item" key={index}>
                      <div className="clinic-doctor-main">
                        <div className="clinic-doctor-avatar">
                          <FaUserDoctor />
                        </div>

                        <div>
                          <h3>{doctor.name}</h3>
                          <p>{doctor.specialty}</p>
                          <span>{doctor.experience}</span>
                        </div>
                      </div>

                      <div className="clinic-doctor-right">
                        <div className="clinic-rating-badge">
                          <FaStar />
                          <span>{doctor.rating}</span>
                        </div>

                        <Link to="/doctor-profile" className="clinic-inline-link">
                          View profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="clinic-profile-right">
              <article className="soft-card clinic-section-card">
                <div className="clinic-section-header">
                  <div>
                    <h2>Patient Reviews</h2>
                    <p>Recent feedback from visitors.</p>
                  </div>
                </div>

                <div className="clinic-reviews-list">
                  {reviews.map((review, index) => (
                    <div className="clinic-review-item" key={index}>
                      <div className="clinic-review-top">
                        <strong>{review.name}</strong>
                        <span>
                          <FaStar />
                          {review.rating}
                        </span>
                      </div>
                      <p>{review.text}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="soft-card clinic-cta-card">
                <h2>Need help choosing a specialty?</h2>
                <p>
                  Use the AI Assistant to describe symptoms and receive a guided clinic
                  or specialist recommendation.
                </p>

                <Link to="/chatbot" className="primary-btn">
                  Open AI Assistant
                  <FaArrowRight />
                </Link>
              </article>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ClinicProfile;
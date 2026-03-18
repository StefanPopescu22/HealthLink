import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClock,
  FaGraduationCap,
  FaHospital,
  FaShieldHeart,
  FaStar,
  FaStethoscope,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/DoctorProfile.css";

function DoctorProfile() {
  const specialties = ["Cardiology", "Preventive Care", "Heart Monitoring", "Internal Medicine"];
  const schedule = [
    "Monday · 09:00 - 15:00",
    "Tuesday · 10:00 - 17:00",
    "Thursday · 09:00 - 14:00",
    "Friday · 11:00 - 18:00",
  ];

  const reviews = [
    {
      name: "Ana Radu",
      rating: "5.0",
      text: "Professional, calm and very clear in explaining the treatment plan.",
    },
    {
      name: "Victor M.",
      rating: "4.9",
      text: "Excellent consultation experience and a very modern digital booking flow.",
    },
  ];

  return (
    <>
      <main className="doctor-profile-page">
        <div className="page-container">
          <section className="doctor-hero soft-card">
            <div className="doctor-hero-main">
              <div className="doctor-badge">
                <FaShieldHeart />
                <span>Verified Specialist</span>
              </div>

              <div className="doctor-title-row">
                <div className="doctor-avatar-large">
                  <FaUserDoctor />
                </div>

                <div>
                  <h1>Dr. Elena Popescu</h1>
                  <p>Cardiology Specialist</p>
                </div>
              </div>

              <div className="doctor-meta-row">
                <span>
                  <FaHospital />
                  MedFuture Clinic
                </span>
                <span>
                  <FaStar />
                  4.9 rating
                </span>
                <span>
                  <FaGraduationCap />
                  12 years experience
                </span>
              </div>

              <p className="doctor-description">
                Dr. Elena Popescu focuses on preventive cardiology, patient education and
                integrated long-term cardiac care. She combines clinical expertise with a
                clear, supportive and structured consultation approach.
              </p>

              <div className="doctor-actions">
                <Link to="/dashboard-patient" className="primary-btn">
                  Book Consultation
                  <FaCalendarCheck />
                </Link>

                <Link to="/clinic-profile" className="secondary-btn">
                  View Clinic
                </Link>
              </div>
            </div>

            <div className="doctor-hero-side">
              <div className="doctor-side-card">
                <h3>Availability</h3>
                <div className="doctor-availability-list">
                  {schedule.map((slot, index) => (
                    <div className="doctor-availability-item" key={index}>
                      <FaClock />
                      <span>{slot}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="doctor-side-card">
                <h3>Quick Facts</h3>
                <div className="doctor-fact">
                  <strong>Language</strong>
                  <span>Romanian · English</span>
                </div>
                <div className="doctor-fact">
                  <strong>Consultation Type</strong>
                  <span>In-person and follow-up guidance</span>
                </div>
                <div className="doctor-fact">
                  <strong>Main Focus</strong>
                  <span>Preventive cardiology</span>
                </div>
              </div>
            </div>
          </section>

          <section className="doctor-profile-content">
            <div className="doctor-profile-left">
              <article className="soft-card doctor-section-card">
                <div className="doctor-section-header">
                  <div>
                    <h2>About the Doctor</h2>
                    <p>Professional summary and consultation approach.</p>
                  </div>
                </div>

                <p className="doctor-long-text">
                  With over a decade of clinical experience, Dr. Elena Popescu supports
                  patients with structured evaluations, follow-up strategies and practical
                  treatment guidance. Her workflow emphasizes digital accessibility,
                  timely communication and well-documented medical decisions.
                </p>
              </article>

              <article className="soft-card doctor-section-card">
                <div className="doctor-section-header">
                  <div>
                    <h2>Specialties & Expertise</h2>
                    <p>Main consultation areas available for booking.</p>
                  </div>
                </div>

                <div className="doctor-specialties-grid">
                  {specialties.map((item, index) => (
                    <div className="doctor-specialty-pill" key={index}>
                      <FaStethoscope />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="doctor-profile-right">
              <article className="soft-card doctor-section-card">
                <div className="doctor-section-header">
                  <div>
                    <h2>Patient Reviews</h2>
                    <p>Recent feedback from consultations.</p>
                  </div>
                </div>

                <div className="doctor-reviews-list">
                  {reviews.map((review, index) => (
                    <div className="doctor-review-item" key={index}>
                      <div className="doctor-review-top">
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

              <article className="soft-card doctor-cta-card">
                <h2>Need a guided recommendation first?</h2>
                <p>
                  Try the AI Assistant and receive a specialty suggestion before booking
                  the most relevant medical consultation.
                </p>

                <Link to="/chatbot" className="primary-btn">
                  Use AI Assistant
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

export default DoctorProfile;
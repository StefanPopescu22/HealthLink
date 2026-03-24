import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import api from "../services/api";
import "../styles/DoctorProfile.css";

function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctor = async () => {
      try {
        const response = await api.get(`/public/doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError("Failed to load doctor profile.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctor();
  }, [id]);

  if (loading) {
    return (
      <>
        <main className="doctor-profile-page">
          <div className="page-container">
            <p>Loading doctor profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !doctor) {
    return (
      <>
        <main className="doctor-profile-page">
          <div className="page-container">
            <p>{error || "Doctor not found."}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const specialties = doctor.specialties
    ? doctor.specialties.split(",").map((item) => item.trim())
    : [];

  const schedule = doctor.schedule_info
    ? doctor.schedule_info.split(",").map((item) => item.trim())
    : [];

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
                  <h1>{doctor.first_name} {doctor.last_name}</h1>
                  <p>{specialties[0] || "Medical Specialist"}</p>
                </div>
              </div>

              <div className="doctor-meta-row">
                <span>
                  <FaHospital />
                  {doctor.clinic_name}
                </span>
                <span>
                  <FaStar />
                  {doctor.rating || "0.0"} rating
                </span>
                <span>
                  <FaGraduationCap />
                  {doctor.experience_years || 0} years experience
                </span>
              </div>

              <p className="doctor-description">
                {doctor.description || "No description available for this doctor."}
              </p>

              <div className="doctor-actions">
                <Link to="/appointments" className="primary-btn">
                  Book Consultation
                  <FaCalendarCheck />
                </Link>

                <Link to={`/clinics/${doctor.clinic_id}`} className="secondary-btn">
                  View Clinic
                </Link>
              </div>
            </div>

            <div className="doctor-hero-side">
              <div className="doctor-side-card">
                <h3>Availability</h3>
                <div className="doctor-availability-list">
                  {schedule.length === 0 && <p>No schedule info available.</p>}
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
                  <strong>Clinic</strong>
                  <span>{doctor.clinic_name}</span>
                </div>
                <div className="doctor-fact">
                  <strong>City</strong>
                  <span>{doctor.clinic_city || "Not set"}</span>
                </div>
                <div className="doctor-fact">
                  <strong>Main Focus</strong>
                  <span>{specialties[0] || "General practice"}</span>
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
                  {doctor.description || "No extended profile description is available yet."}
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
                  {specialties.length === 0 && <p>No specialties assigned.</p>}
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
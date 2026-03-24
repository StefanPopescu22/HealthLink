import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
import api from "../services/api";
import "../styles/ClinicProfile.css";

function ClinicProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClinic = async () => {
      try {
        const response = await api.get(`/public/clinics/${id}`);
        setData(response.data);
      } catch (err) {
        setError("Failed to load clinic profile.");
      } finally {
        setLoading(false);
      }
    };

    loadClinic();
  }, [id]);

  if (loading) {
    return (
      <>
        <main className="clinic-profile-page">
          <div className="page-container">
            <p>Loading clinic profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <main className="clinic-profile-page">
          <div className="page-container">
            <p>{error || "Clinic not found."}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { clinic, doctors, reviews } = data;

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
                  <h1>{clinic.name}</h1>
                  <p>{clinic.clinic_type}</p>
                </div>
              </div>

              <div className="clinic-profile-meta">
                <span>
                  <FaLocationDot />
                  {clinic.city || "City not set"}
                </span>
                <span>
                  <FaStar />
                  {clinic.rating || "0.0"} rating
                </span>
                <span>
                  <FaUserDoctor />
                  {clinic.doctors_count || 0} doctors
                </span>
              </div>

              <p className="clinic-profile-description">
                {clinic.description || "No description available for this clinic."}
              </p>

              <div className="clinic-profile-actions">
                <Link to="/appointments" className="primary-btn">
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
                    <span>{clinic.phone || "No phone available"}</span>
                  </li>
                  <li>
                    <FaEnvelope />
                    <span>{clinic.email || "No email available"}</span>
                  </li>
                  <li>
                    <FaClock />
                    <span>{clinic.address || "Address not set"}</span>
                  </li>
                </ul>
              </div>

              <div className="clinic-side-card">
                <h3>Platform Highlights</h3>
                <div className="clinic-highlight-item">
                  <strong>Fast Booking</strong>
                  <span>Integrated appointment flow</span>
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
                    <h2>Doctors in This Clinic</h2>
                    <p>Real doctors linked to this clinic.</p>
                  </div>
                </div>

                <div className="clinic-doctors-list">
                  {doctors.length === 0 && <p>No doctors available yet.</p>}

                  {doctors.map((doctor) => (
                    <div className="clinic-doctor-item" key={doctor.id}>
                      <div className="clinic-doctor-main">
                        <div className="clinic-doctor-avatar">
                          <FaUserDoctor />
                        </div>

                        <div>
                          <h3>{doctor.first_name} {doctor.last_name}</h3>
                          <p>{doctor.specialties || "No specialties assigned"}</p>
                          <span>{doctor.experience_years || 0} years experience</span>
                        </div>
                      </div>

                      <div className="clinic-doctor-right">
                        <Link to={`/doctors/${doctor.id}`} className="clinic-inline-link">
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
                    <p>Recent real feedback from users.</p>
                  </div>
                </div>

                <div className="clinic-reviews-list">
                  {reviews.length === 0 && <p>No reviews available yet.</p>}

                  {reviews.map((review) => (
                    <div className="clinic-review-item" key={review.id}>
                      <div className="clinic-review-top">
                        <strong>{review.first_name} {review.last_name}</strong>
                        <span>
                          <FaStar />
                          {review.rating}
                        </span>
                      </div>
                      <p>{review.comment || "No comment provided."}</p>
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
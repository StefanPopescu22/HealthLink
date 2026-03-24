import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaHospital,
  FaLocationDot,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Clinics.css";

function Clinics() {
  const [clinics, setClinics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadClinics = async () => {
      try {
        const response = await api.get("/public/clinics");
        setClinics(response.data);
      } catch (err) {
        setError("Failed to load clinics.");
      } finally {
        setLoading(false);
      }
    };

    loadClinics();
  }, []);

  return (
    <>
      <main className="clinics-page">
        <div className="page-container">
          <section className="clinics-hero">
            <div className="clinics-hero-content">
              <div className="clinics-badge">
                <FaShieldHeart />
                <span>Trusted healthcare discovery</span>
              </div>

              <h1 className="clinics-title">
                Find the right <span className="gradient-text">clinic for your needs</span>
              </h1>

              <p className="clinics-subtitle">
                Explore modern healthcare providers by city and rating using real platform data.
              </p>
            </div>
          </section>

          {loading && <p>Loading clinics...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <section className="clinics-grid">
              {clinics.map((clinic) => (
                <article className="soft-card clinic-card" key={clinic.id}>
                  <div className="clinic-card-top">
                    <div className="clinic-card-icon">
                      <FaHospital />
                    </div>

                    <div className="clinic-rating">
                      <FaStar />
                      <span>{clinic.rating || "0.0"}</span>
                    </div>
                  </div>

                  <h2>{clinic.name}</h2>
                  <p className="clinic-specialty">{clinic.clinic_type}</p>
                  <p className="clinic-description">
                    {clinic.description || "No description available yet."}
                  </p>

                  <div className="clinic-meta">
                    <span>
                      <FaLocationDot />
                      {clinic.city || "City not set"}
                    </span>
                    <span>
                      <FaUserDoctor />
                      {clinic.doctors_count || 0} doctors
                    </span>
                  </div>

                  <div className="clinic-actions">
                    <Link to={`/clinics/${clinic.id}`} className="secondary-btn">
                      View Profile
                    </Link>
                    <Link to="/appointments" className="primary-btn clinic-book-btn">
                      <FaCalendarCheck />
                      Book Visit
                    </Link>
                  </div>
                </article>
              ))}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Clinics;
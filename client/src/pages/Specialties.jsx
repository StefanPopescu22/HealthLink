import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaShieldHeart, FaStethoscope } from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Specialties.css";

function Specialties() {
  const [specialties, setSpecialties] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await api.get("/public/specialties");
        setSpecialties(response.data);
      } catch {
        setError("Failed to load specialties.");
      }
    };

    loadSpecialties();
  }, []);

  return (
    <>
      <main className="specialties-page">
        <div className="page-container">
          <section className="specialties-hero">
            <div className="specialties-hero-content">
              <div className="specialties-badge">
                <FaShieldHeart />
                <span>Browse by specialty</span>
              </div>

              <h1 className="specialties-title">
                Explore medical <span className="gradient-text">specialties</span>
              </h1>

              <p className="specialties-subtitle">
                Select a specialty and discover doctors associated with it.
              </p>
            </div>
          </section>

          {error && <p>{error}</p>}

          <section className="specialties-grid">
            {specialties.map((specialty) => (
              <article className="soft-card specialty-card" key={specialty.id}>
                <div className="specialty-icon-box">
                  <FaStethoscope />
                </div>

                <h2>{specialty.name}</h2>
                <p>{specialty.description || "No description available."}</p>

                <div className="specialty-meta">
                  <span>{specialty.doctors_count || 0} doctors</span>
                  <span>{specialty.services_count || 0} services</span>
                </div>

                <Link
                  to={`/doctors?specialtyId=${specialty.id}`}
                  className="primary-btn specialty-btn"
                >
                  Learn More
                  <FaArrowRight />
                </Link>
              </article>
            ))}
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Specialties;
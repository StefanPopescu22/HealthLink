import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaMagnifyingGlass,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Doctors.css";

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await api.get("/public/doctors");
        setDoctors(response.data);
      } catch (err) {
        setError("Failed to load doctors.");
      } finally {
        setLoading(false);
      }
    };

    loadDoctors();
  }, []);

  return (
    <>
      <main className="doctors-page">
        <div className="page-container">
          <section className="doctors-hero">
            <div className="doctors-hero-content">
              <div className="doctors-badge">
                <FaShieldHeart />
                <span>Verified specialists</span>
              </div>

              <h1 className="doctors-title">
                Discover the right <span className="gradient-text">medical specialist</span>
              </h1>

              <p className="doctors-subtitle">
                Explore real doctor profiles, specialties and clinic affiliations.
              </p>
            </div>

            <div className="doctors-search-card soft-card">
              <div className="doctors-search-box">
                <FaMagnifyingGlass />
                <input type="text" placeholder="Search doctor or specialty" />
              </div>
            </div>
          </section>

          {loading && <p>Loading doctors...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <section className="doctors-grid">
              {doctors.map((doctor) => (
                <article className="soft-card doctor-card-public" key={doctor.id}>
                  <div className="doctor-card-top">
                    <div className="doctor-card-avatar">
                      <FaUserDoctor />
                    </div>

                    <div className="doctor-card-rating">
                      <FaStar />
                      <span>{doctor.rating || "0.0"}</span>
                    </div>
                  </div>

                  <h2>{doctor.first_name} {doctor.last_name}</h2>
                  <p className="doctor-card-specialty">
                    {doctor.specialties || "No specialties assigned"}
                  </p>
                  <p className="doctor-card-clinic">{doctor.clinic_name}</p>
                  <p className="doctor-card-description">
                    {doctor.description || "No description available."}
                  </p>

                  <div className="doctor-card-meta">
                    <span>{doctor.experience_years || 0} years experience</span>
                  </div>

                  <div className="doctor-card-actions">
                    <Link to={`/doctors/${doctor.id}`} className="secondary-btn">
                      View Profile
                    </Link>
                    <Link to="/appointments" className="primary-btn">
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

export default Doctors;
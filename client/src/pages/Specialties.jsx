import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaShieldHeart,
  FaStethoscope,
  FaUserDoctor,
  FaLayerGroup,
  FaMagnifyingGlass,
  FaXmark,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Specialties.css";

function Specialties() {
  const [specialties, setSpecialties] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const res = await api.get("/public/specialties");
        setSpecialties(res.data);
      } catch {
        setError("Failed to load specialties.");
      } finally {
        setLoading(false);
      }
    };
    loadSpecialties();
  }, []);

  const filtered = search.trim()
    ? specialties.filter((s) =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        (s.description || "").toLowerCase().includes(search.toLowerCase())
      )
    : specialties;

  const totalDoctors  = specialties.reduce((s, sp) => s + (sp.doctors_count  || 0), 0);
  const totalServices = specialties.reduce((s, sp) => s + (sp.services_count || 0), 0);

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
                Explore medical{" "}
                <span className="gradient-text">specialties</span>
              </h1>

              <p className="specialties-subtitle">
                Select a specialty and discover the doctors and services
                associated with it on the HealthLink platform.
              </p>
            </div>

            <div className="specialties-hero-stats">
              <div className="specialties-stats-header">
                <span>Overview</span>
                <span className="specialties-stats-pill">Live</span>
              </div>
              <div className="specialties-stats-grid">
                <div className="specialties-stat-item">
                  <span className="specialties-stat-label">Specialties</span>
                  <strong>{specialties.length}</strong>
                  <small>available</small>
                </div>
                <div className="specialties-stat-item">
                  <span className="specialties-stat-label">Doctors</span>
                  <strong>{totalDoctors}</strong>
                  <small>registered</small>
                </div>
                <div className="specialties-stat-item">
                  <span className="specialties-stat-label">Services</span>
                  <strong>{totalServices}</strong>
                  <small>offered</small>
                </div>
                <div className="specialties-stat-item">
                  <span className="specialties-stat-label">Status</span>
                  <strong style={{ fontSize: "1.1rem", marginTop: 4 }}>Active</strong>
                  <small>catalog live</small>
                </div>
              </div>
            </div>
          </section>

          <div className="specialties-search-bar">
            <div className="specialties-search-inner">
              <FaMagnifyingGlass />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search specialties by name or description..."
              />
              {search && (
                <button
                  type="button"
                  className="specialties-search-clear"
                  onClick={() => setSearch("")}
                >
                  <FaXmark />
                </button>
              )}
            </div>
            {search && (
              <span className="specialties-search-count">
                <strong>{filtered.length}</strong>{" "}
                {filtered.length === 1 ? "result" : "results"}
              </span>
            )}
          </div>

          {error && (
            <p className="specialties-error">
              <FaXmark /> {error}
            </p>
          )}

          {loading && (
            <div className="specialties-loading">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="specialty-skeleton" style={{ opacity: 1 - i * 0.12 }} />
              ))}
            </div>
          )}

          {!loading && !error && (
            <section className="specialties-grid">
              {filtered.length === 0 ? (
                <div className="specialties-empty">
                  <div className="specialties-empty-icon"><FaStethoscope /></div>
                  <h3>No specialties found</h3>
                  <p>Try a different search term to find the specialty you're looking for.</p>
                </div>
              ) : (
                filtered.map((specialty) => (
                  <SpecialtyCard key={specialty.id} specialty={specialty} />
                ))
              )}
            </section>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}

function SpecialtyCard({ specialty }) {
  return (
    <article className="specialty-card">
      <div className="specialty-card-inner">
        <div className="specialty-icon-box">
          <FaStethoscope />
        </div>

        <h2>{specialty.name}</h2>

        <p>{specialty.description || "No description available for this specialty."}</p>

        <div className="specialty-meta">
          <span className="specialty-meta-chip">
            <FaUserDoctor />
            {specialty.doctors_count || 0}{" "}
            {specialty.doctors_count === 1 ? "doctor" : "doctors"}
          </span>
          <span className="specialty-meta-chip">
            <FaLayerGroup />
            {specialty.services_count || 0}{" "}
            {specialty.services_count === 1 ? "service" : "services"}
          </span>
        </div>
      </div>

      <div className="specialty-card-footer">
        <Link
          to={`/doctors?specialtyId=${specialty.id}`}
          className="specialty-btn"
        >
          <span>Find Doctors</span>
          <div className="specialty-btn-arrow">
            <FaArrowRight />
          </div>
        </Link>
      </div>
    </article>
  );
}

export default Specialties;
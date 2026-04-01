import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaCalendarCheck,
  FaHospital,
  FaHeart,
  FaLocationDot,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
  FaMagnifyingGlass,
  FaXmark,
  FaStethoscope,
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Clinics.css";

/* ================================================================ */
function Clinics() {
  const { user } = useContext(AuthContext);

  const [clinics, setClinics] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    city: "",
    specialty: "",
    minRating: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ── Load data ──────────────────────────────────────────────── */
  const loadClinics = async (currentFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/public/clinics", { params: currentFilters });
      setClinics(res.data);
    } catch {
      setError("Failed to load clinics. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadFavorites = async () => {
    if (!user || user.role !== "patient") return;
    try {
      const res = await api.get("/favorites/my");
      setFavoriteIds(
        Array.isArray(res.data) ? res.data.map((item) => item.id) : []
      );
    } catch {
      setFavoriteIds([]);
    }
  };

  useEffect(() => { loadClinics(); }, []);
  useEffect(() => { loadFavorites(); }, [user]);

  /* ── Handlers ───────────────────────────────────────────────── */
  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    loadClinics(filters);
  };

  const handleReset = () => {
    const empty = { q: "", city: "", specialty: "", minRating: "" };
    setFilters(empty);
    loadClinics(empty);
  };

  const toggleFavorite = async (clinicId) => {
    try {
      if (favoriteIds.includes(clinicId)) {
        await api.delete(`/favorites/${clinicId}`);
        setFavoriteIds((prev) => prev.filter((id) => id !== clinicId));
      } else {
        await api.post(`/favorites/${clinicId}`);
        setFavoriteIds((prev) => [...prev, clinicId]);
      }
    } catch {
      setError("Failed to update favorites.");
    }
  };

  /* ── Derived ────────────────────────────────────────────────── */
  const hasActiveFilters = Object.values(filters).some(Boolean);
  const totalDoctors = clinics.reduce((s, c) => s + (c.doctors_count || 0), 0);

  /* ── Render ─────────────────────────────────────────────────── */
  return (
    <>
      <main className="clinics-page">
        <div className="page-container">

          {/* ── Hero ──────────────────────────────────────── */}
          <section className="clinics-hero">
            {/* Left */}
            <div className="clinics-hero-content">
              <div className="clinics-badge">
                <FaShieldHeart />
                <span>Trusted healthcare discovery</span>
              </div>

              <h1 className="clinics-title">
                Find the right{" "}
                <span className="gradient-text">clinic for your needs</span>
              </h1>

              <p className="clinics-subtitle">
                Search and compare clinics by name, city, specialty and patient
                rating — all powered by live platform data updated in real time.
              </p>
            </div>

            {/* Right — stats */}
            <div className="clinics-hero-stats">
              <div className="clinics-stats-header">
                <span>Platform Overview</span>
                <span className="clinics-stats-pill">Live</span>
              </div>

              <div className="clinics-stats-grid">
                <div className="clinics-stat-item">
                  <span className="clinics-stat-label">Clinics</span>
                  <strong>{clinics.length}</strong>
                  <small>registered</small>
                </div>
                <div className="clinics-stat-item">
                  <span className="clinics-stat-label">Doctors</span>
                  <strong>{totalDoctors}</strong>
                  <small>available</small>
                </div>
                <div className="clinics-stat-item">
                  <span className="clinics-stat-label">Cities</span>
                  <strong>
                    {new Set(clinics.map((c) => c.city).filter(Boolean)).size}
                  </strong>
                  <small>covered</small>
                </div>
                <div className="clinics-stat-item">
                  <span className="clinics-stat-label">Avg Rating</span>
                  <strong style={{ fontSize: "1.4rem" }}>
                    {clinics.length
                      ? (
                          clinics.reduce(
                            (s, c) => s + parseFloat(c.rating || 0),
                            0
                          ) / clinics.length
                        ).toFixed(1)
                      : "—"}
                  </strong>
                  <small>out of 5.0</small>
                </div>
              </div>
            </div>
          </section>

          {/* ── Search form ────────────────────────────────── */}
          <form className="clinics-search-form" onSubmit={handleSearch}>
            <div className="search-field-wrap">
              <span className="search-field-label">Clinic name</span>
              <input
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                placeholder="e.g. MedLife, Sanador..."
              />
            </div>

            <div className="search-field-wrap">
              <span className="search-field-label">City</span>
              <input
                name="city"
                value={filters.city}
                onChange={handleFilterChange}
                placeholder="e.g. Bucharest, Cluj..."
              />
            </div>

            <div className="search-field-wrap">
              <span className="search-field-label">Specialty</span>
              <input
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
                placeholder="e.g. Cardiology..."
              />
            </div>

            <div className="search-field-wrap">
              <span className="search-field-label">Min Rating</span>
              <select
                name="minRating"
                value={filters.minRating}
                onChange={handleFilterChange}
              >
                <option value="">Any rating</option>
                <option value="3">3.0 +</option>
                <option value="4">4.0 +</option>
                <option value="4.5">4.5 +</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, alignSelf: "flex-end" }}>
              <button type="submit" className="primary-btn clinics-search-btn">
                <FaMagnifyingGlass />
                Search
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="secondary-btn clinics-search-btn"
                  onClick={handleReset}
                  title="Clear filters"
                >
                  <FaXmark />
                </button>
              )}
            </div>
          </form>

          {/* ── Error ──────────────────────────────────────── */}
          {error && (
            <p className="clinics-error-msg">
              <FaXmark /> {error}
            </p>
          )}

          {/* ── Results toolbar ────────────────────────────── */}
          {!loading && !error && (
            <div className="clinics-results-toolbar">
              <p className="clinics-results-count">
                Showing{" "}
                <strong>{clinics.length}</strong>{" "}
                {clinics.length === 1 ? "clinic" : "clinics"}
                {hasActiveFilters && " for your search"}
              </p>
            </div>
          )}

    
          {loading && (
            <div className="clinics-loading">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="clinic-skeleton"
                  style={{ opacity: 1 - i * 0.12 }}
                />
              ))}
            </div>
          )}

          {/* ── Clinics grid ───────────────────────────────── */}
          {!loading && !error && (
            <section className="clinics-grid">
              {clinics.length === 0 ? (
                <div className="clinics-empty-state">
                  <div className="clinics-empty-icon">
                    <FaHospital />
                  </div>
                  <h3>No clinics found</h3>
                  <p>
                    Try adjusting your search filters or clear them to see all
                    available clinics.
                  </p>
                </div>
              ) : (
                clinics.map((clinic) => (
                  <ClinicCard
                    key={clinic.id}
                    clinic={clinic}
                    isFavorite={favoriteIds.includes(clinic.id)}
                    showFavorite={user?.role === "patient"}
                    onToggleFavorite={toggleFavorite}
                  />
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

/* ── ClinicCard sub-component ──────────────────────────────────── */
function ClinicCard({ clinic, isFavorite, showFavorite, onToggleFavorite }) {
  return (
    <article className="clinic-card">
      {/* Card body */}
      <div className="clinic-card-body">
        {/* Top row */}
        <div className="clinic-card-top">
          <div className="clinic-card-icon">
            <FaHospital />
          </div>

          <div className="clinic-card-top-right">
            {/* Rating */}
            <div className="clinic-rating">
              <FaStar />
              <span>{parseFloat(clinic.rating || 0).toFixed(1)}</span>
            </div>

            {/* Favorite */}
            {showFavorite && (
              <button
                type="button"
                className={`favorite-icon-btn ${isFavorite ? "active" : ""}`}
                onClick={() => onToggleFavorite(clinic.id)}
                title={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <FaHeart />
              </button>
            )}
          </div>
        </div>

        {/* Name */}
        <h2>{clinic.name}</h2>

        {/* Type */}
        {clinic.clinic_type && (
          <p className="clinic-specialty">
            <FaStethoscope />
            {clinic.clinic_type}
          </p>
        )}

        <p className="clinic-description">
          {clinic.description || "No description available for this clinic."}
        </p>

        <div className="clinic-meta">
          <span className="clinic-meta-chip">
            <FaLocationDot />
            {clinic.city || "City not set"}
          </span>
          <span className="clinic-meta-chip">
            <FaUserDoctor />
            {clinic.doctors_count || 0}{" "}
            {clinic.doctors_count === 1 ? "doctor" : "doctors"}
          </span>
        </div>
      </div>

    
      <div className="clinic-card-footer">
        <Link to={`/clinics/${clinic.id}`} className="clinic-view-btn">
          View Profile
        </Link>
        <Link to="/appointments" className="clinic-book-btn">
          <FaCalendarCheck />
          Book Visit
        </Link>
      </div>
    </article>
  );
}

export default Clinics;
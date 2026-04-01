import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  FaMagnifyingGlass,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
  FaHospital,
  FaStethoscope,
  FaCalendarCheck,
  FaClockRotateLeft,
  FaXmark,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Doctors.css";

function Doctors() {
  const [searchParams] = useSearchParams();

  const [doctors, setDoctors] = useState([]);
  const [clinics, setClinics] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    specialty: "",
    clinicId: "",
    specialtyId: searchParams.get("specialtyId") || "",
    serviceId: searchParams.get("serviceId") || "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDoctors = async (currentFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/public/doctors", { params: currentFilters });
      setDoctors(res.data);
    } catch {
      setError("Failed to load doctors. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeFilters = {
      ...filters,
      specialtyId: searchParams.get("specialtyId") || "",
      serviceId: searchParams.get("serviceId") || "",
    };
    setFilters(activeFilters);
    loadDoctors(activeFilters);

    api.get("/public/clinics")
      .then((res) => setClinics(res.data))
      .catch(() => {});
  }, [searchParams]);

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    loadDoctors(filters);
  };

  const handleReset = () => {
    const empty = { q: "", specialty: "", clinicId: "", specialtyId: "", serviceId: "" };
    setFilters(empty);
    loadDoctors(empty);
  };

  const hasActiveFilters = filters.q || filters.specialty || filters.clinicId;

  const totalClinics = new Set(doctors.map((d) => d.clinic_name).filter(Boolean)).size;
  const avgExp = doctors.length
    ? Math.round(doctors.reduce((s, d) => s + (d.experience_years || 0), 0) / doctors.length)
    : 0;

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
                Discover the right{" "}
                <span className="gradient-text">medical specialist</span>
              </h1>

              <p className="doctors-subtitle">
                Search and compare verified doctors by name, specialty and clinic.
                You can also filter doctors directly from the Specialties and Services pages.
              </p>
            </div>

            <div className="doctors-hero-stats">
              <div className="doctors-stats-header">
                <span>Platform Overview</span>
                <span className="doctors-stats-pill">Live</span>
              </div>

              <div className="doctors-stats-grid">
                <div className="doctors-stat-item">
                  <span className="doctors-stat-label">Doctors</span>
                  <strong>{doctors.length}</strong>
                  <small>registered</small>
                </div>
                <div className="doctors-stat-item">
                  <span className="doctors-stat-label">Clinics</span>
                  <strong>{totalClinics}</strong>
                  <small>represented</small>
                </div>
                <div className="doctors-stat-item">
                  <span className="doctors-stat-label">Avg Exp.</span>
                  <strong style={{ fontSize: "1.4rem" }}>{avgExp}</strong>
                  <small>years avg.</small>
                </div>
                <div className="doctors-stat-item">
                  <span className="doctors-stat-label">Status</span>
                  <strong style={{ fontSize: "1.1rem", marginTop: 4 }}>Active</strong>
                  <small>verified profiles</small>
                </div>
              </div>
            </div>
          </section>

          <form className="doctors-search-toolbar" onSubmit={handleSearch}>
            <div className="search-field-wrap">
              <span className="search-field-label">Name or clinic</span>
              <div className="doctors-search-box">
                <FaMagnifyingGlass />
                <input
                  type="text"
                  name="q"
                  placeholder="e.g. Dr. Popescu, Sanador..."
                  value={filters.q}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="search-field-wrap">
              <span className="search-field-label">Specialty</span>
              <input
                name="specialty"
                value={filters.specialty}
                onChange={handleFilterChange}
                placeholder="e.g. Cardiology..."
                className="doctor-filter-input"
              />
            </div>

            <div className="search-field-wrap">
              <span className="search-field-label">Clinic</span>
              <select
                name="clinicId"
                value={filters.clinicId}
                onChange={handleFilterChange}
                className="doctor-filter-input"
              >
                <option value="">All clinics</option>
                {clinics.map((clinic) => (
                  <option key={clinic.id} value={clinic.id}>
                    {clinic.name}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ display: "flex", gap: 10, alignSelf: "flex-end" }}>
              <button type="submit" className="primary-btn doctors-search-btn">
                <FaMagnifyingGlass />
                Search
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="secondary-btn doctors-search-btn"
                  onClick={handleReset}
                  title="Clear filters"
                  style={{ minWidth: 48, padding: 0 }}
                >
                  <FaXmark />
                </button>
              )}
            </div>
          </form>

          {error && (
            <p className="doctors-error-msg">
              <FaXmark /> {error}
            </p>
          )}

          {loading && (
            <div className="doctors-loading">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="doctor-skeleton" style={{ opacity: 1 - i * 0.12 }} />
              ))}
            </div>
          )}

          {!loading && !error && (
            <section className="doctors-grid">
              {doctors.length === 0 ? (
                <div className="doctors-empty-state">
                  <div className="doctors-empty-icon">
                    <FaUserDoctor />
                  </div>
                  <h3>No doctors found</h3>
                  <p>
                    Try adjusting your search filters or clear them to see all
                    available doctors.
                  </p>
                </div>
              ) : (
                doctors.map((doctor) => (
                  <DoctorCard key={doctor.id} doctor={doctor} />
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

function DoctorCard({ doctor }) {
  return (
    <article className="doctor-card-public">
      <div className="doctor-card-body">
        <div className="doctor-card-top">
          <div className="doctor-card-avatar">
            <FaUserDoctor />
          </div>
          <div className="doctor-card-rating">
            <FaStar />
            <span>{parseFloat(doctor.rating || 0).toFixed(1)}</span>
          </div>
        </div>

        <h2>Dr. {doctor.first_name} {doctor.last_name}</h2>

        {doctor.specialties && (
          <p className="doctor-card-specialty">
            <FaStethoscope />
            {doctor.specialties}
          </p>
        )}

        {doctor.clinic_name && (
          <p className="doctor-card-clinic">
            <FaHospital />
            {doctor.clinic_name}
          </p>
        )}

        <p className="doctor-card-description">
          {doctor.description || "No description available for this doctor."}
        </p>

        <div className="doctor-card-meta">
          <span className="doctor-meta-chip">
            <FaClockRotateLeft />
            {doctor.experience_years || 0}{" "}
            {doctor.experience_years === 1 ? "yr" : "yrs"} experience
          </span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <Link to={`/doctors/${doctor.id}`} className="doctor-view-btn">
          View Profile
        </Link>
        <Link to="/appointments" className="doctor-book-btn">
          <FaCalendarCheck />
          Book Visit
        </Link>
      </div>
    </article>
  );
}

export default Doctors;
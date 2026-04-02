import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaClock,
  FaShieldHeart,
  FaStethoscope,
  FaMagnifyingGlass,
  FaHospital,
  FaTag,
  FaMoneyBillWave,
  FaXmark,
  FaLayerGroup,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({ q: "", category: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async (currentFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/public/services", { params: currentFilters });
      setServices(res.data);
    } catch {
      setError("Failed to load services. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadServices(); }, []);

  const handleFilterChange = (e) =>
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSearch = (e) => {
    e.preventDefault();
    loadServices(filters);
  };

  const handleReset = () => {
    const empty = { q: "", category: "" };
    setFilters(empty);
    loadServices(empty);
  };

  const hasActiveFilters = filters.q || filters.category;

  const totalClinics = services.reduce((s, svc) => s + (svc.clinics_count || 0), 0);
  const categories = new Set(services.map((s) => s.specialty_name).filter(Boolean)).size;

  return (
    <>
      <main className="services-page">
        <div className="page-container">

          <section className="services-hero">
            <div className="services-hero-content">
              <div className="services-badge">
                <FaShieldHeart />
                <span>Structured medical services</span>
              </div>

              <h1 className="services-title">
                Explore available{" "}
                <span className="gradient-text">medical services</span>
              </h1>

              <p className="services-subtitle">
                Browse all services offered on the platform, compare durations,
                pricing and clinics. Click any service to find matching doctors.
              </p>
            </div>

            <div className="services-hero-stats">
              <div className="services-stats-header">
                <span>Services Overview</span>
                <span className="services-stats-pill">Live</span>
              </div>

              <div className="services-stats-grid">
                <div className="services-stat-item">
                  <span className="services-stat-label">Services</span>
                  <strong>{services.length}</strong>
                  <small>available</small>
                </div>
                <div className="services-stat-item">
                  <span className="services-stat-label">Specialties</span>
                  <strong>{categories}</strong>
                  <small>covered</small>
                </div>
                <div className="services-stat-item">
                  <span className="services-stat-label">Clinics</span>
                  <strong>{totalClinics}</strong>
                  <small>offering services</small>
                </div>
                <div className="services-stat-item">
                  <span className="services-stat-label">Status</span>
                  <strong style={{ fontSize: "1.1rem", marginTop: 4 }}>Active</strong>
                  <small>catalog online</small>
                </div>
              </div>
            </div>
          </section>

          <form className="services-search-form" onSubmit={handleSearch}>
            <div className="svc-field-wrap">
              <span className="svc-field-label">Service name</span>
              <input
                name="q"
                value={filters.q}
                onChange={handleFilterChange}
                placeholder="e.g. ECG, Consultation, MRI..."
              />
            </div>

            <div className="svc-field-wrap">
              <span className="svc-field-label">Category</span>
              <input
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                placeholder="e.g. Diagnostic, Treatment..."
              />
            </div>

            <div style={{ display: "flex", gap: 10, alignSelf: "flex-end" }}>
              <button type="submit" className="primary-btn services-search-btn">
                <FaMagnifyingGlass />
                Search
              </button>
              {hasActiveFilters && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={handleReset}
                  title="Clear filters"
                  style={{ minHeight: 52, minWidth: 52, padding: 0, borderRadius: "var(--radius-md)" }}
                >
                  <FaXmark />
                </button>
              )}
            </div>
          </form>

          {error && (
            <p className="services-error-msg">
              <FaXmark /> {error}
            </p>
          )}

          {loading && (
            <div className="services-loading">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="service-skeleton" style={{ opacity: 1 - i * 0.12 }} />
              ))}
            </div>
          )}

          {!loading && !error && (
            <section className="services-grid">
              {services.length === 0 ? (
                <div className="services-empty-state">
                  <div className="services-empty-icon">
                    <FaStethoscope />
                  </div>
                  <h3>No services found</h3>
                  <p>
                    Try adjusting your search filters or clear them to see all
                    available medical services.
                  </p>
                </div>
              ) : (
                services.map((service) => (
                  <ServiceCard key={service.id} service={service} />
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

function ServiceCard({ service }) {
  return (
    <article className="service-card">
      <div className="service-card-body">
        <div className="service-icon-box">
          <FaStethoscope />
        </div>

        <h2>{service.name}</h2>

        {service.specialty_name && (
          <p className="service-category">
            <FaLayerGroup />
            {service.specialty_name}
          </p>
        )}

        <p className="service-description">
          {service.description || "No description available for this service."}
        </p>

        <div className="service-meta">
          {service.duration_minutes > 0 && (
            <span className="service-meta-chip chip-duration">
              <FaClock />
              {service.duration_minutes} min
            </span>
          )}
          {service.clinics_count > 0 && (
            <span className="service-meta-chip chip-clinics">
              <FaHospital />
              {service.clinics_count}{" "}
              {service.clinics_count === 1 ? "clinic" : "clinics"}
            </span>
          )}
          <span className="service-meta-chip chip-price">
            <FaMoneyBillWave />
            {service.starting_price
              ? `From ${parseFloat(service.starting_price).toFixed(0)} RON`
              : "Price TBD"}
          </span>
        </div>
      </div>

      <div className="service-card-footer">
        <Link
          to={`/doctors?serviceId=${service.id}`}
          className="service-btn"
        >
          Find Doctors
          <FaArrowRight />
        </Link>
      </div>
    </article>
  );
}

export default Services;
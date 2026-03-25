import { useEffect, useState } from "react";
import {
  FaArrowRight,
  FaClock,
  FaFilter,
  FaShieldHeart,
  FaStethoscope,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Services.css";

function Services() {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    category: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadServices = async (currentFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/public/services", { params: currentFilters });
      setServices(response.data);
    } catch {
      setError("Failed to load services.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadServices(filters);
  };

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
                Explore available <span className="gradient-text">medical services</span>
              </h1>

              <p className="services-subtitle">
                Search services by name and category using live platform data.
              </p>
            </div>
          </section>

          <form className="services-search-form soft-card" onSubmit={handleSearch}>
            <input
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Search service name"
            />
            <input
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              placeholder="Category"
            />
            <button type="submit" className="primary-btn">
              Search
            </button>
          </form>

          {loading && <p>Loading services...</p>}
          {error && <p>{error}</p>}

          {!loading && !error && (
            <section className="services-grid">
              {services.map((service) => (
                <article className="soft-card service-card" key={service.id}>
                  <div className="service-icon-box">
                    <FaStethoscope />
                  </div>

                  <h2>{service.name}</h2>
                  <p className="service-category">{service.category}</p>
                  <p className="service-description">
                    {service.description || "No description available."}
                  </p>

                  <div className="service-meta">
                    <span>
                      <FaClock />
                      {service.duration_minutes || 0} min
                    </span>
                    <span>{service.clinics_count || 0} clinics</span>
                    <span>
                      {service.starting_price ? `From ${service.starting_price} RON` : "Price not set"}
                    </span>
                  </div>

                  <button className="primary-btn service-btn">
                    Select Service
                    <FaArrowRight />
                  </button>
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

export default Services;
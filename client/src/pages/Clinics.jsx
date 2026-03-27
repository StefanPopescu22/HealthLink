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
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/Clinics.css";

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

  const loadClinics = async (currentFilters = filters) => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/public/clinics", { params: currentFilters });
      setClinics(response.data);
    } catch (err) {
      setError("Failed to load clinics.");
    } finally {
      setLoading(false);
    }
  };

    const loadFavorites = async () => {
      if (!user || user.role !== "patient") return;

      try {
        const response = await api.get("/favorites/my");
        const clinicIds = Array.isArray(response.data)
          ? response.data.map((item) => item.id)
          : [];

        setFavoriteIds(clinicIds);
      } catch {
        setFavoriteIds([]);
      }
    };

  useEffect(() => {
    loadClinics();
  }, []);

  useEffect(() => {
    loadFavorites();
  }, [user]);

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadClinics(filters);
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
                Search clinics by name, city, specialty and rating using live platform data.
              </p>
            </div>
          </section>

          <form className="clinics-search-form soft-card" onSubmit={handleSearch}>
            <input
              name="q"
              value={filters.q}
              onChange={handleFilterChange}
              placeholder="Search clinic name"
            />
            <input
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="City"
            />
            <input
              name="specialty"
              value={filters.specialty}
              onChange={handleFilterChange}
              placeholder="Specialty"
            />
            <select name="minRating" value={filters.minRating} onChange={handleFilterChange}>
              <option value="">Min rating</option>
              <option value="3">3+</option>
              <option value="4">4+</option>
              <option value="4.5">4.5+</option>
            </select>
            <button type="submit" className="primary-btn">
              Search
            </button>
          </form>

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

                    <div className="clinic-card-top-right">
                      <div className="clinic-rating">
                        <FaStar />
                        <span>{clinic.rating || "0.0"}</span>
                      </div>

                      {user?.role === "patient" && (
                        <button
                          type="button"
                          className={`favorite-icon-btn ${favoriteIds.includes(clinic.id) ? "active" : ""}`}
                          onClick={() => toggleFavorite(clinic.id)}
                        >
                          <FaHeart />
                        </button>
                      )}
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
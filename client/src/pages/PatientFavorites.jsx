import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHeart,
  FaHospital,
  FaLocationDot,
  FaStar,
  FaArrowRight,
  FaTrash,
  FaCheck,
  FaXmark,
  FaPhone,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/PatientFavorites.css";

function PatientFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workingId, setWorkingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFavorites = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get("/favorites/my");
      setFavorites(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load favorites.");
      setFavorites([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (clinicId) => {
    setError("");
    setSuccess("");
    setWorkingId(clinicId);

    try {
      const response = await api.delete(`/favorites/${clinicId}`);
      setSuccess(response.data.message || "Clinic removed from favorites.");
      await loadFavorites();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove favorite.");
    } finally {
      setWorkingId(null);
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="favorites-page">
              <div className="favorites-header">
                <div className="favorites-header-text">
                  <div className="favorites-badge">
                    <FaHeart />
                    Patient Dashboard
                  </div>
                  <h1>Favorite Clinics</h1>
                  <p>Your saved clinics from live platform data.</p>
                </div>
                <div className="favorites-header-meta">
                  <div className="favorites-count">
                    <strong>{favorites.length}</strong>
                    <span>Saved</span>
                  </div>
                </div>
              </div>

              {error && (
                <p className="favorites-message error">
                  <FaXmark /> {error}
                </p>
              )}
              {success && (
                <p className="favorites-message success">
                  <FaCheck /> {success}
                </p>
              )}

              {!loading && favorites.length > 0 && (
                <div className="favorites-results-bar">
                  <p className="favorites-results-count">
                    <strong>{favorites.length}</strong>{" "}
                    {favorites.length === 1 ? "clinic" : "clinics"} saved
                  </p>
                </div>
              )}

              {loading ? (
                <div className="favorites-loading">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="favorite-skeleton"
                      style={{ opacity: 1 - i * 0.12 }}
                    />
                  ))}
                </div>
              ) : (
                <div className="favorites-grid">
                  {favorites.length === 0 ? (
                    <div className="favorites-empty">
                      <div className="favorites-empty-icon">
                        <FaHeart />
                      </div>
                      <h3>No favorites yet</h3>
                      <p>
                        Browse clinics and tap the heart icon to save the ones
                        you want to revisit.
                      </p>
                      <Link to="/clinics" className="fav-view-btn">
                        Explore Clinics <FaArrowRight />
                      </Link>
                    </div>
                  ) : (
                    favorites.map((clinic) => (
                      <article className="favorite-card" key={clinic.id}>
                        <div className="favorite-card-body">
                          <div className="favorite-card-top">
                            <div className="favorite-card-icon">
                              <FaHospital />
                            </div>
                            <div className="favorite-card-rating">
                              <FaStar />
                              {clinic.rating || "0.0"}
                            </div>
                          </div>

                          <h3>{clinic.name}</h3>

                          <div className="favorite-card-chips">
                            {clinic.city && (
                              <span className="favorite-chip">
                                <FaLocationDot /> {clinic.city}
                              </span>
                            )}
                            {clinic.clinic_type && (
                              <span className="favorite-chip">
                                {clinic.clinic_type}
                              </span>
                            )}
                            {clinic.phone && (
                              <span className="favorite-chip">
                                <FaPhone /> {clinic.phone}
                              </span>
                            )}
                          </div>

                          {clinic.description && (
                            <p className="favorite-card-desc">
                              {clinic.description}
                            </p>
                          )}
                        </div>

                        <div className="favorite-card-footer">
                          <Link
                            to={`/clinics/${clinic.id}`}
                            className="fav-view-btn"
                          >
                            Open Clinic <FaArrowRight />
                          </Link>
                          <button
                            type="button"
                            className="fav-remove-btn"
                            disabled={workingId === clinic.id}
                            onClick={() => removeFavorite(clinic.id)}
                            title="Remove from favorites"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PatientFavorites;
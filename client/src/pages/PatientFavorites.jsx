import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaHospital, FaStar } from "react-icons/fa6";
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
              <div className="soft-card favorites-header">
                <h1>Favorite Clinics</h1>
                <p>Your saved clinics from live platform data.</p>
              </div>

              {error && <p className="favorites-message error">{error}</p>}
              {success && <p className="favorites-message success">{success}</p>}

              {loading ? (
                <div className="soft-card empty-state-card">Loading favorite clinics...</div>
              ) : (
                <div className="favorites-grid">
                  {favorites.length === 0 && (
                    <div className="soft-card empty-state-card">
                      You do not have favorite clinics yet.
                    </div>
                  )}

                  {favorites.map((clinic) => (
                    <article className="soft-card favorite-card" key={clinic.id}>
                      <div className="favorite-card-top">
                        <div className="favorite-card-icon">
                          <FaHospital />
                        </div>
                        <div className="favorite-card-rating">
                          <FaStar />
                          <span>{clinic.rating || "0.0"}</span>
                        </div>
                      </div>

                      <h3>{clinic.name}</h3>
                      <p>{clinic.clinic_type}</p>
                      <span>{clinic.city || "City not set"}</span>

                      <div className="favorite-card-actions">
                        <Link to={`/clinics/${clinic.id}`} className="secondary-btn">
                          Open Clinic
                        </Link>

                        <button
                          type="button"
                          className="primary-btn"
                          disabled={workingId === clinic.id}
                          onClick={() => removeFavorite(clinic.id)}
                        >
                          <FaHeart />
                          {workingId === clinic.id ? "Removing..." : "Remove"}
                        </button>
                      </div>
                    </article>
                  ))}
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
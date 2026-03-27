import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  FaArrowRight,
  FaCalendarCheck,
  FaClock,
  FaEnvelope,
  FaHeart,
  FaHospital,
  FaLocationDot,
  FaPhone,
  FaShieldHeart,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/ClinicProfile.css";
import { validateReviewForm } from "../utils/formValidators";

function ClinicProfile() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    rating: "5",
    comment: "",
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClinic = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await api.get(`/public/clinics/${id}`);
      setData(response.data);
    } catch (err) {
      setError("Failed to load clinic profile.");
    } finally {
      setLoading(false);
    }
  };

  const loadPatientExtras = async () => {
    if (!user || user.role !== "patient") return;

    try {
      const [favoritesRes, reviewRes] = await Promise.all([
        api.get("/favorites/my"),
        api.get(`/reviews/clinic/${id}/my`),
      ]);

      const favoriteList = Array.isArray(favoritesRes.data) ? favoritesRes.data : [];
      setIsFavorite(favoriteList.some((item) => String(item.id) === String(id)));

      if (reviewRes.data) {
        setMyReview(reviewRes.data);
        setReviewForm({
          rating: String(reviewRes.data.rating),
          comment: reviewRes.data.comment || "",
        });
      } else {
        setMyReview(null);
        setReviewForm({
          rating: "5",
          comment: "",
        });
      }
    } catch {
      setIsFavorite(false);
    }
  };

  useEffect(() => {
    loadClinic();
  }, [id]);

  useEffect(() => {
    loadPatientExtras();
  }, [user, id]);

  const handleFavoriteToggle = async () => {
    try {
      if (isFavorite) {
        await api.delete(`/favorites/${id}`);
        setIsFavorite(false);
      } else {
        await api.post(`/favorites/${id}`);
        setIsFavorite(true);
      }
    } catch {
      setError("Failed to update favorite.");
    }
  };

  const handleReviewChange = (e) => {
    setReviewForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

      const handleReviewSubmit = async (e) => {
      e.preventDefault();
      setMessage("");
      setError("");

      const validationMessage = validateReviewForm(reviewForm);
      if (validationMessage) {
        setError(validationMessage);
        return;
      }

      try {
        if (myReview) {
          await api.put(`/reviews/${myReview.id}`, reviewForm);
          setMessage("Review updated successfully.");
        } else {
          await api.post(`/reviews/clinic/${id}`, reviewForm);
          setMessage("Review created successfully.");
        }

        await loadClinic();
        await loadPatientExtras();
      } catch (err) {
        setError(err.response?.data?.message || "Failed to save review.");
      }
    };

  const handleReviewDelete = async () => {
    if (!myReview) return;

    setMessage("");
    setError("");

    try {
      await api.delete(`/reviews/${myReview.id}`);
      setMessage("Review deleted successfully.");
      await loadClinic();
      await loadPatientExtras();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete review.");
    }
  };

  if (loading) {
    return (
      <>
        <main className="clinic-profile-page">
          <div className="page-container">
            <p>Loading clinic profile...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !data) {
    return (
      <>
        <main className="clinic-profile-page">
          <div className="page-container">
            <p>{error || "Clinic not found."}</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { clinic, doctors, reviews } = data;

  return (
    <>
      <main className="clinic-profile-page">
        <div className="page-container">
          <section className="clinic-profile-hero soft-card">
            <div className="clinic-profile-main">
              <div className="clinic-profile-badge">
                <FaShieldHeart />
                <span>Verified Medical Provider</span>
              </div>

              <div className="clinic-profile-title-row">
                <div className="clinic-profile-icon">
                  <FaHospital />
                </div>

                <div>
                  <h1>{clinic.name}</h1>
                  <p>{clinic.clinic_type}</p>
                </div>
              </div>

              <div className="clinic-profile-meta">
                <span>
                  <FaLocationDot />
                  {clinic.city || "City not set"}
                </span>
                <span>
                  <FaStar />
                  {clinic.rating || "0.0"} rating
                </span>
                <span>
                  <FaUserDoctor />
                  {clinic.doctors_count || 0} doctors
                </span>
              </div>

              <p className="clinic-profile-description">
                {clinic.description || "No description available for this clinic."}
              </p>

              <div className="clinic-profile-actions">
                <Link to="/appointments" className="primary-btn">
                  Book Appointment
                  <FaCalendarCheck />
                </Link>

                {user?.role === "patient" && (
                  <button
                    type="button"
                    className={`secondary-btn clinic-favorite-btn ${isFavorite ? "active" : ""}`}
                    onClick={handleFavoriteToggle}
                  >
                    <FaHeart />
                    {isFavorite ? "Saved" : "Save Clinic"}
                  </button>
                )}
              </div>
            </div>

            <div className="clinic-profile-side">
              <div className="clinic-side-card">
                <h3>Contact Information</h3>
                <ul>
                  <li>
                    <FaPhone />
                    <span>{clinic.phone || "No phone available"}</span>
                  </li>
                  <li>
                    <FaEnvelope />
                    <span>{clinic.email || "No email available"}</span>
                  </li>
                  <li>
                    <FaClock />
                    <span>{clinic.address || "Address not set"}</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {user?.role === "patient" && (
            <section className="soft-card clinic-review-form-card">
              <h2>{myReview ? "Edit Your Review" : "Leave a Review"}</h2>

              <form className="clinic-review-form" onSubmit={handleReviewSubmit}>
                <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
                  <option value="5">5 stars</option>
                  <option value="4">4 stars</option>
                  <option value="3">3 stars</option>
                  <option value="2">2 stars</option>
                  <option value="1">1 star</option>
                </select>

                <textarea
                  name="comment"
                  value={reviewForm.comment}
                  onChange={handleReviewChange}
                  placeholder="Write your review"
                />

                <div className="clinic-review-form-actions">
                  <button type="submit" className="primary-btn">
                    {myReview ? "Update Review" : "Submit Review"}
                  </button>

                  {myReview && (
                    <button
                      type="button"
                      className="secondary-btn"
                      onClick={handleReviewDelete}
                    >
                      Delete Review
                    </button>
                  )}
                </div>
              </form>

              {message && <p className="clinic-review-message success">{message}</p>}
              {error && <p className="clinic-review-message error">{error}</p>}
            </section>
          )}

          <section className="clinic-profile-content">
            <div className="clinic-profile-left">
              <article className="soft-card clinic-section-card">
                <div className="clinic-section-header">
                  <div>
                    <h2>Doctors in This Clinic</h2>
                    <p>Real doctors linked to this clinic.</p>
                  </div>
                </div>

                <div className="clinic-doctors-list">
                  {doctors.length === 0 && <p>No doctors available yet.</p>}

                  {doctors.map((doctor) => (
                    <div className="clinic-doctor-item" key={doctor.id}>
                      <div className="clinic-doctor-main">
                        <div className="clinic-doctor-avatar">
                          <FaUserDoctor />
                        </div>

                        <div>
                          <h3>{doctor.first_name} {doctor.last_name}</h3>
                          <p>{doctor.specialties || "No specialties assigned"}</p>
                          <span>{doctor.experience_years || 0} years experience</span>
                        </div>
                      </div>

                      <div className="clinic-doctor-right">
                        <Link to={`/doctors/${doctor.id}`} className="clinic-inline-link">
                          View profile
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </article>
            </div>

            <div className="clinic-profile-right">
              <article className="soft-card clinic-section-card">
                <div className="clinic-section-header">
                  <div>
                    <h2>Patient Reviews</h2>
                    <p>Real feedback from users.</p>
                  </div>
                </div>

                <div className="clinic-reviews-list">
                  {reviews.length === 0 && <p>No reviews available yet.</p>}

                  {reviews.map((review) => (
                    <div className="clinic-review-item" key={review.id}>
                      <div className="clinic-review-top">
                        <strong>{review.first_name} {review.last_name}</strong>
                        <span>
                          <FaStar />
                          {review.rating}
                        </span>
                      </div>
                      <p>{review.comment || "No comment provided."}</p>
                    </div>
                  ))}
                </div>
              </article>

              <article className="soft-card clinic-cta-card">
                <h2>Need help choosing a specialty?</h2>
                <p>
                  Use the AI Assistant later, after the rest of the platform is finalized.
                </p>

                <Link to="/specialties" className="primary-btn">
                  Browse Specialties
                  <FaArrowRight />
                </Link>
              </article>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default ClinicProfile;
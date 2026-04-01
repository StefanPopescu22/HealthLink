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
  FaCheck,
  FaXmark,
  FaStethoscope,
  FaClockRotateLeft,
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import Footer from "../components/Footer";
import ReviewCard from "../components/ReviewCard";
import api from "../services/api";
import "../styles/ClinicProfile.css";
import { validateReviewForm } from "../utils/formValidators";

function ClinicProfile() {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [data, setData] = useState(null);
  const [myReview, setMyReview] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: "5", comment: "" });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadClinic = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get(`/public/clinics/${id}`);
      setData(res.data);
    } catch {
      setError("Failed to load clinic profile.");
    } finally {
      setLoading(false);
    }
  };

  const loadPatientExtras = async () => {
    if (!user || user.role !== "patient") return;
    try {
      const [favRes, reviewRes] = await Promise.all([
        api.get("/favorites/my"),
        api.get(`/reviews/clinic/${id}/my`),
      ]);
      const favList = Array.isArray(favRes.data) ? favRes.data : [];
      setIsFavorite(favList.some((item) => String(item.id) === String(id)));
      if (reviewRes.data) {
        setMyReview(reviewRes.data);
        setReviewForm({ rating: String(reviewRes.data.rating), comment: reviewRes.data.comment || "" });
      } else {
        setMyReview(null);
        setReviewForm({ rating: "5", comment: "" });
      }
    } catch {
      setIsFavorite(false);
    }
  };

  useEffect(() => { loadClinic(); }, [id]);
  useEffect(() => { loadPatientExtras(); }, [user, id]);

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

  const handleReviewChange = (e) =>
    setReviewForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setMessage(""); setError("");
    const validationMessage = validateReviewForm(reviewForm);
    if (validationMessage) { setError(validationMessage); return; }
    try {
      if (myReview) {
        await api.put(`/reviews/${myReview.id}`, reviewForm);
        setMessage("Review updated successfully.");
      } else {
        await api.post(`/reviews/clinic/${id}`, reviewForm);
        setMessage("Review submitted successfully.");
      }
      await loadClinic();
      await loadPatientExtras();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save review.");
    }
  };

  const handleReviewDelete = async () => {
    if (!myReview) return;
    setMessage(""); setError("");
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
            <div className="clinic-profile-skeleton-hero" />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginTop: 20 }}>
              <div className="clinic-profile-skeleton-block" />
              <div className="clinic-profile-skeleton-block" />
            </div>
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
            <div className="clinic-profile-error">
              <FaXmark />
              {error || "Clinic not found."}
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const { clinic, doctors, reviews } = data;
  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + parseFloat(r.rating || 0), 0) / reviews.length).toFixed(1)
    : clinic.rating || "0.0";

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
                  <p className="clinic-type-label">{clinic.clinic_type}</p>
                </div>
              </div>

              <div className="clinic-profile-meta">
                <span>
                  <FaLocationDot />
                  {clinic.city || "City not set"}
                </span>
                <span>
                  <FaStar />
                  {avgRating} rating
                </span>
                <span>
                  <FaUserDoctor />
                  {clinic.doctors_count || 0} doctors
                </span>
                <span>
                  <FaStar />
                  {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
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

              <div className="clinic-side-card clinic-rating-summary">
                <div className="clinic-rating-big">
                  <strong>{avgRating}</strong>
                  <div className="clinic-rating-stars-row">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar
                        key={i}
                        style={{ color: i < Math.round(parseFloat(avgRating)) ? "#f59e0b" : "#e5e7eb" }}
                      />
                    ))}
                  </div>
                  <span>{reviews.length} patient {reviews.length === 1 ? "review" : "reviews"}</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Review form ─────────────────────────────────── */}
          {user?.role === "patient" && (
            <section className="soft-card clinic-review-form-card">
              <div className="clinic-review-form-header">
                <div>
                  <h2>{myReview ? "Edit Your Review" : "Leave a Review"}</h2>
                  <p>Share your experience with other patients.</p>
                </div>
                {myReview && (
                  <span className="clinic-has-review-badge">
                    <FaCheck /> You reviewed this clinic
                  </span>
                )}
              </div>

              <form className="clinic-review-form" onSubmit={handleReviewSubmit}>
                <div className="clinic-review-form-row">
                  <div className="clinic-review-field">
                    <label>Rating</label>
                    <select name="rating" value={reviewForm.rating} onChange={handleReviewChange}>
                      <option value="5">⭐⭐⭐⭐⭐ — Excellent (5)</option>
                      <option value="4">⭐⭐⭐⭐ — Good (4)</option>
                      <option value="3">⭐⭐⭐ — Average (3)</option>
                      <option value="2">⭐⭐ — Poor (2)</option>
                      <option value="1">⭐ — Very poor (1)</option>
                    </select>
                  </div>
                </div>

                <div className="clinic-review-field">
                  <label>Your comment</label>
                  <textarea
                    name="comment"
                    value={reviewForm.comment}
                    onChange={handleReviewChange}
                    placeholder="Describe your experience, waiting time, staff quality..."
                  />
                </div>

                <div className="clinic-review-form-actions">
                  <button type="submit" className="primary-btn">
                    <FaCheck />
                    {myReview ? "Update Review" : "Submit Review"}
                  </button>
                  {myReview && (
                    <button type="button" className="clinic-delete-review-btn" onClick={handleReviewDelete}>
                      <FaXmark />
                      Delete Review
                    </button>
                  )}
                </div>
              </form>

              {message && <p className="clinic-review-message success"><FaCheck /> {message}</p>}
              {error   && <p className="clinic-review-message error"><FaXmark /> {error}</p>}
            </section>
          )}

          {/* ── Content grid ────────────────────────────────── */}
          <section className="clinic-profile-content">
            <div className="clinic-profile-left">
              <article className="soft-card clinic-section-card">
                <div className="clinic-section-header">
                  <h2>Doctors in This Clinic</h2>
                  <p>Medical professionals available at {clinic.name}.</p>
                </div>

                <div className="clinic-doctors-list">
                  {doctors.length === 0 ? (
                    <div className="clinic-empty-state">
                      <FaUserDoctor />
                      <span>No doctors listed yet.</span>
                    </div>
                  ) : (
                    doctors.map((doctor) => (
                      <div className="clinic-doctor-item" key={doctor.id}>
                        <div className="clinic-doctor-main">
                          <div className="clinic-doctor-avatar">
                            <FaUserDoctor />
                          </div>
                          <div>
                            <h3>Dr. {doctor.first_name} {doctor.last_name}</h3>
                            <p>
                              <FaStethoscope />
                              {doctor.specialties || "No specialties assigned"}
                            </p>
                            <span>
                              <FaClockRotateLeft />
                              {doctor.experience_years || 0} yrs experience
                            </span>
                          </div>
                        </div>
                        <div className="clinic-doctor-right">
                          <Link to={`/doctors/${doctor.id}`} className="clinic-doctor-link">
                            View profile <FaArrowRight />
                          </Link>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </article>
            </div>

            <div className="clinic-profile-right">
              <article className="soft-card clinic-section-card">
                <div className="clinic-section-header">
                  <h2>Patient Reviews</h2>
                  <p>
                    {reviews.length > 0
                      ? `${reviews.length} verified ${reviews.length === 1 ? "review" : "reviews"} from patients.`
                      : "No reviews yet — be the first to share your experience."}
                  </p>
                </div>

                <div className="clinic-reviews-list">
                  {reviews.length === 0 ? (
                    <div className="clinic-empty-state">
                      <FaStar />
                      <span>No reviews yet.</span>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <ReviewCard key={review.id} review={review} />
                    ))
                  )}
                </div>
              </article>

              <article className="soft-card clinic-cta-card">
                <h2>Need help choosing a specialty?</h2>
                <p>
                  Browse all available medical specialties and find the right
                  specialist for your condition.
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
import { useId } from "react";
import { FaCalendarDays, FaUser } from "react-icons/fa6";
import "../styles/ReviewCard.css";

const formatDate = (dateStr) => {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return null;
  }
};

function ReviewCard({ review }) {
  const { first_name, last_name, rating, comment, created_at } = review;
  const uid = useId();

  const fullName = [first_name, last_name].filter(Boolean).join(" ") || "Anonymous";
  const initials = `${(first_name || "A").charAt(0)}${(last_name || "").charAt(0)}`.toUpperCase();
  const stars = Math.min(5, Math.max(1, parseInt(rating) || 5));
  const date = formatDate(created_at);

  return (
    <article className="review-card">
      <div className="review-card-top">
        <div className="review-card-author">
          <div className="review-avatar">
            {initials || <FaUser size={14} />}
          </div>
          <div className="review-author-info">
            <strong>{fullName}</strong>
            {date && (
              <span className="review-date">
                <FaCalendarDays />
                {date}
              </span>
            )}
          </div>
        </div>

        <div className="review-rating-wrapper">
          <div className="rating">
            <input type="radio" value="5" name={uid} id={`${uid}-5`} defaultChecked={stars === 5} readOnly />
            <label title="5 stars" htmlFor={`${uid}-5`} />
            <input type="radio" value="4" name={uid} id={`${uid}-4`} defaultChecked={stars === 4} readOnly />
            <label title="4 stars" htmlFor={`${uid}-4`} />
            <input type="radio" value="3" name={uid} id={`${uid}-3`} defaultChecked={stars === 3} readOnly />
            <label title="3 stars" htmlFor={`${uid}-3`} />
            <input type="radio" value="2" name={uid} id={`${uid}-2`} defaultChecked={stars === 2} readOnly />
            <label title="2 stars" htmlFor={`${uid}-2`} />
            <input type="radio" value="1" name={uid} id={`${uid}-1`} defaultChecked={stars === 1} readOnly />
            <label title="1 star" htmlFor={`${uid}-1`} />
          </div>
          <span className="review-rating-number">{stars}.0</span>
        </div>
      </div>

      <p className="review-comment">
        {comment?.trim() || "No written comment provided."}
      </p>
    </article>
  );
}

export default ReviewCard;
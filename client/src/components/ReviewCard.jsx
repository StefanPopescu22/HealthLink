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

  const fullName = [first_name, last_name].filter(Boolean).join(" ") || "Anonymous";
  const initials = `${(first_name || "A").charAt(0)}${(last_name || "").charAt(0)}`.toUpperCase();
  const stars = Math.min(5, Math.max(1, parseInt(rating) || 5));
  const date = formatDate(created_at);
  const radioGroupId = `review-rate-${Math.random().toString(36).substr(2, 9)}`;

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
            <input value="5" name={radioGroupId} id={`${radioGroupId}-5`} type="radio" checked={stars === 5} readOnly />
            <label title="5 stars" htmlFor={`${radioGroupId}-5`}></label>
            <input value="4" name={radioGroupId} id={`${radioGroupId}-4`} type="radio" checked={stars === 4} readOnly />
            <label title="4 stars" htmlFor={`${radioGroupId}-4`}></label>
            <input value="3" name={radioGroupId} id={`${radioGroupId}-3`} type="radio" checked={stars === 3} readOnly />
            <label title="3 stars" htmlFor={`${radioGroupId}-3`}></label>
            <input value="2" name={radioGroupId} id={`${radioGroupId}-2`} type="radio" checked={stars === 2} readOnly />
            <label title="2 stars" htmlFor={`${radioGroupId}-2`}></label>
            <input value="1" name={radioGroupId} id={`${radioGroupId}-1`} type="radio" checked={stars === 1} readOnly />
            <label title="1 star" htmlFor={`${radioGroupId}-1`}></label>
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
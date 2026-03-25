const {
  getReviewByUserAndClinic,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
} = require("../models/reviewModel");
const { clinicExists } = require("../models/clinicModel");
const { isValidRating, isPositiveInt, normalizeText } = require("../utils/validators");

const getMyClinicReview = async (req, res) => {
  try {
    const clinicId = Number(req.params.clinicId);

    if (!isPositiveInt(clinicId)) {
      return res.status(400).json({
        message: "Invalid clinic id.",
      });
    }

    const review = await getReviewByUserAndClinic(req.user.id, clinicId);

    return res.status(200).json(review || null);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to load your review.",
      error: error.message,
    });
  }
};

const createClinicReview = async (req, res) => {
  try {
    const clinicId = Number(req.params.clinicId);
    const { rating, comment } = req.body;

    if (!isPositiveInt(clinicId)) {
      return res.status(400).json({
        message: "Invalid clinic id.",
      });
    }

    const clinic = await clinicExists(clinicId);
    if (!clinic) {
      return res.status(404).json({
        message: "Clinic not found.",
      });
    }

    if (!isValidRating(rating)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    const safeComment = normalizeText(comment);
    if (safeComment.length > 1000) {
      return res.status(400).json({
        message: "Review comment must be under 1000 characters.",
      });
    }

    const existingReview = await getReviewByUserAndClinic(req.user.id, clinicId);
    if (existingReview) {
      return res.status(409).json({
        message: "You already reviewed this clinic.",
      });
    }

    const reviewId = await createReview({
      userId: req.user.id,
      clinicId,
      rating: Number(rating),
      comment: safeComment,
    });

    return res.status(201).json({
      message: "Review created successfully.",
      reviewId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create review.",
      error: error.message,
    });
  }
};

const editReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);
    const { rating, comment } = req.body;

    if (!isPositiveInt(reviewId)) {
      return res.status(400).json({
        message: "Invalid review id.",
      });
    }

    if (!isValidRating(rating)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5.",
      });
    }

    const safeComment = normalizeText(comment);
    if (safeComment.length > 1000) {
      return res.status(400).json({
        message: "Review comment must be under 1000 characters.",
      });
    }

    const review = await getReviewById(reviewId);
    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        message: "You cannot edit this review.",
      });
    }

    await updateReview({
      reviewId,
      rating: Number(rating),
      comment: safeComment,
    });

    return res.status(200).json({
      message: "Review updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update review.",
      error: error.message,
    });
  }
};

const removeReview = async (req, res) => {
  try {
    const reviewId = Number(req.params.reviewId);

    if (!isPositiveInt(reviewId)) {
      return res.status(400).json({
        message: "Invalid review id.",
      });
    }

    const review = await getReviewById(reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found.",
      });
    }

    if (review.user_id !== req.user.id) {
      return res.status(403).json({
        message: "You cannot delete this review.",
      });
    }

    await deleteReview(reviewId);

    return res.status(200).json({
      message: "Review deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete review.",
      error: error.message,
    });
  }
};

module.exports = {
  getMyClinicReview,
  createClinicReview,
  editReview,
  removeReview,
};
export const validateAppointmentForm = (formData) => {
  if (!formData.clinicId) return "Please select a clinic.";
  if (!formData.doctorId) return "Please select a doctor.";
  if (!formData.appointmentDate) return "Please select an appointment date.";
  if (!formData.appointmentTime) return "Please select an appointment time.";

  const today = new Date();
  const selected = new Date(`${formData.appointmentDate}T00:00:00`);
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (selected < todayOnly) return "Appointment date cannot be in the past.";

  return "";
};

export const validateReviewForm = (formData) => {
  const rating = Number(formData.rating);

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    return "Rating must be between 1 and 5.";
  }

  if ((formData.comment || "").trim().length > 1000) {
    return "Review comment must be under 1000 characters.";
  }

  return "";
};
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

export const validateDoctorForm = (formData, workingHours) => {
  if (!formData.firstName || formData.firstName.trim().length < 2) {
    return "First name must have at least 2 characters.";
  }

  if (!formData.lastName || formData.lastName.trim().length < 2) {
    return "Last name must have at least 2 characters.";
  }

  if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
    return "Please enter a valid email address.";
  }

  if (!formData.password || formData.password.length < 6) {
    return "Password must have at least 6 characters.";
  }

  if (!Array.isArray(formData.specialtyIds) || formData.specialtyIds.length === 0) {
    return "At least one specialty is required.";
  }

  if (!Array.isArray(workingHours) || workingHours.length === 0) {
    return "At least one working interval is required.";
  }

  for (const item of workingHours) {
    if (item.startTime >= item.endTime) {
      return "Each working interval must have start time earlier than end time.";
    }
  }

  return "";
};
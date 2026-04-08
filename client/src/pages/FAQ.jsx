import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChevronDown,
  FaShieldHeart,
  FaUserDoctor,
  FaHospital,
  FaCalendarCheck,
  FaFileMedical,
  FaRobot,
  FaLock,
  FaCircleQuestion,
} from "react-icons/fa6";
import Footer from "../components/Footer";
import "../styles/FAQ.css";

const CATEGORIES = [
  { id: "general",      label: "General",          icon: <FaCircleQuestion /> },
  { id: "patients",     label: "For Patients",      icon: <FaShieldHeart /> },
  { id: "doctors",      label: "For Doctors",       icon: <FaUserDoctor /> },
  { id: "clinics",      label: "For Clinics",       icon: <FaHospital /> },
  { id: "appointments", label: "Appointments",      icon: <FaCalendarCheck /> },
  { id: "documents",    label: "Documents",         icon: <FaFileMedical /> },
  { id: "ai",           label: "AI Assistant",      icon: <FaRobot /> },
  { id: "security",     label: "Privacy & Security",icon: <FaLock /> },
];

const FAQS = [
  {
    category: "general",
    question: "What is HealthLink?",
    answer:
      "HealthLink is a digital healthcare platform that connects patients, doctors and clinics through a unified workspace. It supports appointment scheduling, medical document management, clinic discovery, AI symptom guidance and role-specific dashboards for patients, doctors, clinic administrators and system admins.",
  },
  {
    category: "general",
    question: "Who can use HealthLink?",
    answer:
      "HealthLink is designed for five distinct roles: Visitors (browsing without an account), Patients (registered users managing their health), Doctors (medical professionals linked to a clinic), Clinic Administrators (managing clinic operations), and Platform Administrators (overseeing the entire system). Each role has a dedicated interface and set of features.",
  },
  {
    category: "general",
    question: "Is HealthLink free to use?",
    answer:
      "Patient registration and basic use of the platform is free. Clinic and doctor accounts are created internally by platform administrators through a verified onboarding process. All core features — appointments, document storage, clinic discovery and the AI assistant — are available at no charge during the current MVP phase.",
  },
  {
    category: "general",
    question: "Is HealthLink a replacement for visiting a doctor?",
    answer:
      "No. HealthLink is a tool to help you navigate the healthcare system more efficiently. It helps you find the right specialist, schedule appointments and manage your medical records — but it does not diagnose conditions or replace professional medical advice, examination or treatment.",
  },
  {
    category: "patients",
    question: "How do I create a patient account?",
    answer:
      "Visit the Register page and fill in your first name, last name, email address and a password. Patient self-registration is open to everyone. Clinic, doctor and admin accounts are created through internal, verified workflows and are not available via the public registration form.",
  },
  {
    category: "patients",
    question: "Can I update my medical profile information?",
    answer:
      "Yes. From the Profile section of your dashboard, you can update your phone number, date of birth, gender, blood group, emergency contact details, allergies and medical notes. This information helps doctors and clinics provide you with better, more personalized care.",
  },
  {
    category: "patients",
    question: "Can I save clinics to a favorites list?",
    answer:
      "Yes. On any clinic profile or in the clinics list, you will find a heart icon button. Clicking it saves the clinic to your Favorites section, accessible from your patient dashboard sidebar. You can remove clinics from your favorites at any time.",
  },
  {
    category: "patients",
    question: "Can I leave a review for a clinic?",
    answer:
      "Yes. Logged-in patients can leave a star rating and a written review on any clinic profile. You can edit or delete your review at any time. Reviews help other patients make informed decisions when choosing a clinic.",
  },
  {
    category: "doctors",
    question: "How is a doctor account created?",
    answer:
      "Doctor accounts are created by clinic administrators or platform administrators through the internal management panels. Doctors do not self-register. Once created, a doctor can log in, manage their profile, view their appointment schedule and review patient records linked to their consultations.",
  },
  {
    category: "doctors",
    question: "What can a doctor do on the platform?",
    answer:
      "Doctors can view and manage their appointment schedule, access patient profiles linked to their consultations, add medical notes and recommendations, upload documents and analyses for patients, update their professional profile and manage their working schedule through their clinic's admin.",
  },
  {
    category: "doctors",
    question: "Can a doctor see all patients on the platform?",
    answer:
      "No. Doctors can only see patients who are linked to their appointments. This ensures privacy and keeps the patient-doctor relationship properly scoped to actual consultations. Doctors cannot browse or search general patient records.",
  },
  {
    category: "clinics",
    question: "How do I get a clinic listed on HealthLink?",
    answer:
      "Clinic accounts are created by platform administrators following a verification process. If you represent a clinic and would like to be listed, contact the HealthLink admin team. Once approved, the clinic administrator can manage doctors, services, appointments and the clinic's public profile.",
  },
  {
    category: "clinics",
    question: "Can a clinic add their own doctors?",
    answer:
      "Yes. Clinic administrators can create new doctor profiles, assign specialties, manage working schedules and edit doctor information directly from the Manage Doctors section in their dashboard. They can also remove doctors or adjust their profiles at any time.",
  },
  {
    category: "clinics",
    question: "Can clinics manage their services and specialties?",
    answer:
      "Yes. From the Services panel, clinic administrators can add medical specialties, create services within each specialty, set durations, categories and pricing, and manage the complete service catalog that appears on the clinic's public profile.",
  },
  {
    category: "appointments",
    question: "How do I book an appointment?",
    answer:
      "Navigate to the Appointments section from your patient dashboard. Select a clinic, then choose a doctor from that clinic, pick a date and a time, and optionally add notes about your visit. The appointment will be created with a 'pending' status and will be confirmed by the clinic or doctor.",
  },
  {
    category: "appointments",
    question: "Can I cancel or reschedule an appointment?",
    answer:
      "Yes. From your Upcoming Appointments view, you can cancel any pending or confirmed appointment that has not yet been completed. Rescheduling requires cancelling the current appointment and booking a new one. Cancelled appointments move to your Appointment History.",
  },
  {
    category: "appointments",
    question: "What do the appointment status labels mean?",
    answer:
      "Appointments have four possible statuses: Pending (created, awaiting confirmation), Confirmed (accepted by the clinic or doctor), Completed (the visit has taken place), and Cancelled (the appointment was cancelled by the patient, doctor or clinic).",
  },
  {
    category: "appointments",
    question: "Can a doctor or clinic cancel my appointment?",
    answer:
      "Yes. Both doctors and clinic administrators have the ability to confirm, complete or cancel appointments from their respective dashboards. You will be able to see the updated status reflected in your appointment history.",
  },
  {
    category: "documents",
    question: "What types of documents can I upload?",
    answer:
      "You can upload PDF, JPG, JPEG and PNG files. These can include medical analyses, laboratory results, prescriptions, discharge summaries, X-ray reports or any other health-related document you want to store securely in your digital health archive.",
  },
  {
    category: "documents",
    question: "Can doctors upload documents to my account?",
    answer:
      "Yes. Doctors linked to your appointments can upload documents and analyses directly to your profile from the Patient Details view. This allows them to share results, notes or prescriptions with you digitally, without relying on paper or separate file transfers.",
  },
  {
    category: "documents",
    question: "Can I delete my uploaded documents?",
    answer:
      "Yes. From the Medical Documents and Medical Analyses sections, you can delete any file you have uploaded. Deletions are permanent, so make sure you have a local copy of anything you may need in the future before removing it.",
  },
  {
    category: "ai",
    question: "What does the AI Assistant do?",
    answer:
      "The AI Assistant analyses descriptions of your symptoms written in natural language and suggests the most relevant medical specialty. It also provides a brief recommendation for the next step — such as booking a consultation, monitoring frequency or seeking urgent care. It currently covers 19 medical specialty categories.",
  },
  {
    category: "ai",
    question: "Does the AI Assistant diagnose conditions?",
    answer:
      "No. The AI Assistant is an orientation tool only. It does not diagnose medical conditions, prescribe treatments or replace a doctor's examination. Its role is to reduce uncertainty and help you decide which type of specialist to consult — not to tell you what is wrong.",
  },
  {
    category: "ai",
    question: "How accurate is the AI Assistant?",
    answer:
      "The assistant uses keyword matching and natural language patterns to suggest a relevant specialty. It is designed to be broadly correct for common symptom descriptions. For ambiguous or complex cases it defaults to General Medicine. Always consult a real doctor for proper evaluation.",
  },
  {
    category: "security",
    question: "How is my medical data protected?",
    answer:
      "HealthLink uses role-based access control, meaning each user type (patient, doctor, clinic, admin) can only access the data relevant to their role. Authentication is handled via JWT tokens. Passwords are hashed before storage and sensitive medical data is never exposed in client-side responses beyond what is necessary.",
  },
  {
    category: "security",
    question: "Can other patients see my medical records?",
    answer:
      "No. Your medical records, appointments, documents and analyses are private to your account. Doctors can access patient data only if they are linked to that patient's appointments. Clinics can view their own patients' files. No cross-patient data exposure is possible through the platform.",
  },
  {
    category: "security",
    question: "Can I delete my account?",
    answer:
      "Account deletion is available from the Profile settings for patient accounts. This will permanently remove your personal data, appointments, documents and associated records. If you experience any issues, contact the platform administrator for assistance.",
  },
];

function FAQ() {
  const [activeCategory, setActiveCategory] = useState("general");
  const [openIndex, setOpenIndex] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = FAQS.filter((faq) => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      !search.trim() ||
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleToggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  const handleCategoryChange = (id) => {
    setActiveCategory(id);
    setOpenIndex(null);
  };

  return (
    <>
      <main className="faq-page">
        <div className="page-container">

          <section className="faq-hero">
            <div className="faq-hero-tag">
              <FaCircleQuestion />
              <span>Help Centre</span>
            </div>
            <h1 className="faq-hero-title">
              Frequently Asked <span className="gradient-text">Questions</span>
            </h1>
            <p className="faq-hero-subtitle">
              Find answers about how HealthLink works, how to manage your account,
              appointments, documents, the AI assistant and platform security.
            </p>

            <div className="faq-search-bar">
              <FaCircleQuestion />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); setOpenIndex(null); }}
                placeholder="Search questions..."
              />
              {search && (
                <button className="faq-search-clear" onClick={() => setSearch("")}>✕</button>
              )}
            </div>
          </section>

          <div className="faq-layout">
            <aside className="faq-sidebar">
              <div className="faq-sidebar-label">Categories</div>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  className={`faq-cat-btn ${activeCategory === cat.id ? "active" : ""}`}
                  onClick={() => handleCategoryChange(cat.id)}
                >
                  <span className="faq-cat-icon">{cat.icon}</span>
                  {cat.label}
                  <span className="faq-cat-count">
                    {FAQS.filter((f) => f.category === cat.id).length}
                  </span>
                </button>
              ))}
            </aside>

            <div className="faq-content">
              {search && (
                <div className="faq-search-results-label">
                  <strong>{filtered.length}</strong> result{filtered.length !== 1 ? "s" : ""} for "{search}"
                </div>
              )}

              {filtered.length === 0 ? (
                <div className="faq-empty">
                  <FaCircleQuestion />
                  <h3>No questions found</h3>
                  <p>Try a different search term or browse by category.</p>
                </div>
              ) : (
                <div className="faq-list">
                  {filtered.map((faq, i) => (
                    <article
                      key={i}
                      className={`faq-item ${openIndex === i ? "open" : ""}`}
                    >
                      <button className="faq-question" onClick={() => handleToggle(i)}>
                        <span>{faq.question}</span>
                        <span className="faq-chevron">
                          <FaChevronDown />
                        </span>
                      </button>
                      {openIndex === i && (
                        <div className="faq-answer">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              )}

              <div className="faq-still-help">
                <div className="faq-still-help-icon"><FaShieldHeart /></div>
                <div>
                  <h3>Still need help?</h3>
                  <p>
                    Can't find what you're looking for? Browse our platform or
                    learn more about HealthLink on the About page.
                  </p>
                </div>
                <div className="faq-still-help-actions">
                  <Link to="/about" className="primary-btn faq-help-btn">
                    About HealthLink <FaArrowRight />
                  </Link>
                  <Link to="/register" className="secondary-btn faq-help-btn">
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

export default FAQ;

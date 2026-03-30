import { useEffect, useState } from "react";
import {
  FaDownload,
  FaFileMedical,
  FaFlask,
  FaHospital,
  FaMagnifyingGlass,
  FaNotesMedical,
  FaShieldHeart,
  FaTrash,
  FaUpload,
  FaCheck,
  FaXmark,
  FaCircleCheck,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/MedicalAnalyses.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

/* ── Helper: format date ─────────────────────────────────────── */
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

/* ================================================================ */
function MedicalAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    analysisType: "",
    labName: "",
    resultStatus: "available",
    file: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ── Load ─────────────────────────────────────────────────── */
  const loadAnalyses = async () => {
    setLoading(true);
    try {
      const res = await api.get("/analyses/my");
      setAnalyses(res.data);
    } catch {
      setError("Failed to load analyses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadAnalyses(); }, []);

  /* ── Derived stats ────────────────────────────────────────── */
  const reviewedCount  = analyses.filter((a) => a.result_status === "reviewed").length;
  const availableCount = analyses.filter((a) => a.result_status === "available").length;

  /* ── Handlers ─────────────────────────────────────────────── */
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "file" ? (files[0] || null) : value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    setSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("analysisType", formData.analysisType);
      payload.append("labName", formData.labName);
      payload.append("resultStatus", formData.resultStatus);
      payload.append("file", formData.file);

      const res = await api.post("/analyses", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(res.data.message || "Analysis uploaded successfully.");
      setFormData({ title: "", analysisType: "", labName: "", resultStatus: "available", file: null });

      const fileInput = document.getElementById("medical-analysis-file");
      if (fileInput) fileInput.value = "";

      await loadAnalyses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload analysis.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (analysisId) => {
    setError(""); setSuccess("");
    try {
      const res = await api.delete(`/analyses/${analysisId}`);
      setSuccess(res.data.message || "Analysis deleted successfully.");
      await loadAnalyses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete analysis.");
    }
  };

  /* ── Render ───────────────────────────────────────────────── */
  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="analyses-page">

              {/* ── Hero ────────────────────────────────────── */}
              <section className="analyses-hero">
                {/* Left content */}
                <div className="analyses-hero-content">
                  <div className="analyses-badge">
                    <FaShieldHeart />
                    <span>Smart analysis management</span>
                  </div>

                  <h1 className="analyses-title">
                    Manage your{" "}
                    <span className="gradient-text">medical analyses</span>
                  </h1>

                  <p className="analyses-subtitle">
                    Upload and organise real laboratory files. Access your full
                    analysis history, download results and track review status
                    from one secure workspace.
                  </p>
                </div>

                {/* Right stats card */}
                <div className="analyses-side-card">
                  <div className="analyses-side-header">
                    <span>Analyses Overview</span>
                    <span className="analyses-side-pill">Live</span>
                  </div>

                  <div className="analyses-side-stats">
                    <div className="analyses-stat-item">
                      <span className="analyses-stat-label">Total</span>
                      <strong>{analyses.length}</strong>
                      <small>uploaded files</small>
                    </div>
                    <div className="analyses-stat-item">
                      <span className="analyses-stat-label">Reviewed</span>
                      <strong>{reviewedCount}</strong>
                      <small>by a doctor</small>
                    </div>
                    <div className="analyses-stat-item">
                      <span className="analyses-stat-label">Available</span>
                      <strong>{availableCount}</strong>
                      <small>pending review</small>
                    </div>
                    <div className="analyses-stat-item">
                      <span className="analyses-stat-label">Status</span>
                      <strong style={{ fontSize: "1.1rem", marginTop: 4 }}>Active</strong>
                      <small>archive online</small>
                    </div>
                  </div>

                  {/* Search */}
                  <div className="analyses-search-box">
                    <FaMagnifyingGlass />
                    <input
                      type="text"
                      placeholder="Search your analyses..."
                      disabled
                    />
                  </div>
                </div>
              </section>

              {/* ── Upload form ──────────────────────────────── */}
              <section className="analyses-upload-form-card">
                <div className="analyses-form-heading">
                  <h2>Upload New Analysis</h2>
                  <p>
                    Add a laboratory result or medical analysis file to your
                    personal health archive.
                  </p>
                </div>

                <form className="analyses-upload-form" onSubmit={handleUpload}>
                  {/* Title */}
                  <div className="analyses-upload-group">
                    <label>Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g. Complete Blood Count"
                    />
                  </div>

                  {/* Type */}
                  <div className="analyses-upload-group">
                    <label>Analysis Type</label>
                    <input
                      name="analysisType"
                      value={formData.analysisType}
                      onChange={handleChange}
                      placeholder="e.g. Biochemistry, Haematology"
                    />
                  </div>

                  {/* Lab name */}
                  <div className="analyses-upload-group">
                    <label>Laboratory Name</label>
                    <input
                      name="labName"
                      value={formData.labName}
                      onChange={handleChange}
                      placeholder="e.g. Synevo, Medlife Lab"
                    />
                  </div>

                  {/* Status */}
                  <div className="analyses-upload-group">
                    <label>Result Status</label>
                    <select
                      name="resultStatus"
                      value={formData.resultStatus}
                      onChange={handleChange}
                    >
                      <option value="available">Available</option>
                      <option value="reviewed">Reviewed</option>
                    </select>
                  </div>

                  {/* File */}
                  <div className="analyses-upload-group full">
                    <label>File (PDF, JPG, PNG)</label>
                    <input
                      id="medical-analysis-file"
                      name="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                    />
                  </div>

                  {/* Submit */}
                  <div className="analyses-upload-group full">
                    <button
                      type="submit"
                      className="primary-btn analyses-upload-btn"
                      disabled={submitting}
                    >
                      <FaUpload />
                      {submitting ? "Uploading…" : "Upload Analysis"}
                    </button>
                  </div>
                </form>

                {error   && <p className="analyses-message error"><FaXmark /> {error}</p>}
                {success && <p className="analyses-message success"><FaCheck /> {success}</p>}
              </section>

              {/* ── List header ──────────────────────────────── */}
              <div className="analyses-section-heading">
                <div>
                  <h2>Your Analyses</h2>
                  <p>All uploaded laboratory results and medical files.</p>
                </div>
                {analyses.length > 0 && (
                  <span className="analyses-count-pill">
                    {analyses.length} {analyses.length === 1 ? "file" : "files"}
                  </span>
                )}
              </div>

              {/* ── Analyses list ─────────────────────────────── */}
              <div className="analyses-list">
                {loading && (
                  <>
                    <div className="analysis-skeleton" />
                    <div className="analysis-skeleton" style={{ opacity: 0.6 }} />
                    <div className="analysis-skeleton" style={{ opacity: 0.35 }} />
                  </>
                )}

                {!loading && analyses.length === 0 && (
                  <div className="analyses-empty-state">
                    <div className="analyses-empty-icon">
                      <FaNotesMedical />
                    </div>
                    <h3>No analyses uploaded yet</h3>
                    <p>
                      Use the form above to upload your first laboratory result
                      or medical analysis.
                    </p>
                  </div>
                )}

                {!loading && analyses.map((item) => (
                  <article className="analysis-card" key={item.id}>
                    {/* Icon */}
                    <div className="analysis-icon-box">
                      <FaNotesMedical />
                    </div>

                    {/* Content */}
                    <div className="analysis-content">
                      <h3>{item.title}</h3>
                      <p className="analysis-type">{item.analysis_type || "—"}</p>

                      <div className="analysis-meta">
                        {item.lab_name && (
                          <span className="analysis-meta-chip">
                            <FaHospital />
                            {item.lab_name}
                          </span>
                        )}
                        {item.uploaded_at && (
                          <span className="analysis-meta-chip">
                            <FaFlask />
                            {formatDate(item.uploaded_at)}
                          </span>
                        )}
                        <span className={`analysis-result ${item.result_status?.toLowerCase()}`}>
                          {item.result_status === "reviewed" && <FaCircleCheck />}
                          {item.result_status}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="analysis-actions">
                      <a
                        href={`${BACKEND_URL}${item.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="analysis-download-btn"
                      >
                        <FaDownload />
                        Download
                      </a>
                      <button
                        className="analysis-delete-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── Summary cards ─────────────────────────────── */}
              <section className="analyses-summary">
                <article className="analyses-summary-card">
                  <div className="analysis-summary-icon">
                    <FaFileMedical />
                  </div>
                  <h3>{analyses.length} Total Analyses</h3>
                  <p>Stored securely in your digital healthcare archive.</p>
                </article>

                <article className="analyses-summary-card">
                  <div className="analysis-summary-icon">
                    <FaCircleCheck />
                  </div>
                  <h3>{reviewedCount} Reviewed</h3>
                  <p>Analyses that have been checked by a medical professional.</p>
                </article>

                <article className="analyses-summary-card">
                  <div className="analysis-summary-icon">
                    <FaNotesMedical />
                  </div>
                  <h3>Live Data</h3>
                  <p>All analyses are loaded directly from your secure backend.</p>
                </article>
              </section>

            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default MedicalAnalyses;
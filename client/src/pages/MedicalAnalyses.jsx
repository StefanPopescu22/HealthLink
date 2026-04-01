import { useEffect, useState, useMemo } from "react";
import { 
  FaVial, 
  FaShieldHalved, 
  FaDownload, 
  FaTrash, 
  FaFileMedical, 
  FaUserDoctor, 
  FaHospital, 
  FaUpload,
  FaFilePdf
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/MedicalAnalyses.css";

function MedicalAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    analysisType: "",
    file: null,
  });

  const loadData = async () => {
    setError("");
    try {
      setLoading(true);
      const response = await api.get("/analyses/my");
      setAnalyses(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Failed to load medical analyses. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: analyses.length,
      recent: analyses.filter(a => new Date(a.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
    };
  }, [analyses]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] }));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.analysisType || !formData.file) {
      setError("Please fill in all fields and select a file.");
      return;
    }

    try {
      setUploading(true);
      const data = new FormData();
      data.append("title", formData.title);
      data.append("analysis_type", formData.analysisType);
      data.append("file", formData.file);

      await api.post("/analyses", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess("Analysis uploaded successfully.");
      setFormData({ title: "", analysisType: "", file: null });
      document.getElementById("fileInput").value = "";
      await loadData();
    } catch {
      setError("Failed to upload the analysis.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    setError("");
    try {
      await api.delete(`/analyses/${id}`);
      setSuccess("Document deleted successfully.");
      await loadData();
    } catch {
      setError("Failed to delete the document.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="analyses-page">
              
              <section className="analyses-hero">
                <div className="analyses-hero-content glass-panel">
                  <div className="analyses-badge">
                    <FaShieldHalved />
                    <span>Secure Medical Records</span>
                  </div>
                  <h1 className="analyses-title">
                    Medical <span className="gradient-text">Analyses</span>
                  </h1>
                  <p className="analyses-subtitle">
                    Access, review, and manage your laboratory results and medical documents in one secure, encrypted environment.
                  </p>
                </div>

                <div className="analyses-side-card glass-panel">
                  <div className="analyses-side-header">
                    <span>Records Overview</span>
                    <span className="analyses-side-pill">Active</span>
                  </div>
                  <div className="analyses-side-stats">
                    <div className="analyses-stat-item">
                      <span className="analyses-stat-label">Total Documents</span>
                      <strong>{stats.total}</strong>
                      <small>files securely stored</small>
                    </div>
                    <div className="analyses-stat-item">
                      <span className="analyses-stat-label">Recent Updates</span>
                      <strong>{stats.recent}</strong>
                      <small>in the last 30 days</small>
                    </div>
                  </div>
                </div>
              </section>

              <section className="analyses-upload-form-card glass-panel">
                <div className="analyses-form-heading">
                  <h2>Upload New Document</h2>
                  <p>Add personal medical records, lab results, or imaging reports.</p>
                </div>

                <form className="analyses-upload-form" onSubmit={handleUpload}>
                  <div className="analyses-upload-group">
                    <label htmlFor="title">Document Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      placeholder="e.g., Annual Blood Test"
                    />
                  </div>

                  <div className="analyses-upload-group">
                    <label htmlFor="analysisType">Document Type</label>
                    <select
                      id="analysisType"
                      name="analysisType"
                      value={formData.analysisType}
                      onChange={handleInputChange}
                    >
                      <option value="">Select category...</option>
                      <option value="Blood Test">Blood Test</option>
                      <option value="Urine Test">Urine Test</option>
                      <option value="Imaging">Imaging (X-Ray, MRI, CT)</option>
                      <option value="Biopsy">Biopsy</option>
                      <option value="General Report">General Medical Report</option>
                    </select>
                  </div>

                  <div className="analyses-upload-group full">
                    <label htmlFor="fileInput">Select File (PDF, JPG, PNG)</label>
                    <input
                      type="file"
                      id="fileInput"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleFileChange}
                    />
                  </div>

                  <div className="analyses-upload-group full">
                    <button type="submit" className="primary-btn analyses-upload-btn" disabled={uploading}>
                      <FaUpload /> {uploading ? "Uploading Document..." : "Upload Document"}
                    </button>
                  </div>
                </form>

                {error && <div className="analyses-message error">{error}</div>}
                {success && <div className="analyses-message success">{success}</div>}
              </section>

              <section className="analyses-list-section">
                <div className="analyses-section-heading">
                  <h2>Your Medical Records</h2>
                  <span className="analyses-count-pill">{analyses.length} Records</span>
                </div>

                <div className="analyses-list">
                  {loading ? (
                    <div className="analysis-skeleton"></div>
                  ) : analyses.length === 0 ? (
                    <div className="analyses-empty-state glass-panel">
                      <div className="analyses-empty-icon">
                        <FaFileMedical />
                      </div>
                      <h3>No records found</h3>
                      <p>You haven't uploaded any medical documents yet. Use the form above to add your first record.</p>
                    </div>
                  ) : (
                    analyses.map((item) => (
                      <article className="analysis-card glass-panel" key={item.id}>
                        <div className="analysis-icon-box">
                          {item.analysis_type === "Imaging" ? <FaVial /> : <FaFilePdf />}
                        </div>

                        <div className="analysis-content">
                          <h3>{item.title}</h3>
                          <div className="analysis-type">{item.analysis_type || "General Document"}</div>
                          
                          <div className="analysis-meta">
                            {item.clinic_name && (
                              <span className="analysis-meta-chip">
                                <FaHospital /> {item.clinic_name}
                              </span>
                            )}
                            {item.doctor_first_name && (
                              <span className="analysis-meta-chip">
                                <FaUserDoctor /> Dr. {item.doctor_first_name} {item.doctor_last_name}
                              </span>
                            )}
                            {item.result_status && (
                              <span className={`analysis-result ${item.result_status.toLowerCase()}`}>
                                {item.result_status}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="analysis-actions">
                          <a
                            href={`http://localhost:5000${item.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="analysis-download-btn"
                          >
                            <FaDownload /> View
                          </a>
                          <button 
                            className="analysis-delete-btn"
                            onClick={() => handleDelete(item.id)}
                          >
                            <FaTrash /> Delete
                          </button>
                        </div>
                      </article>
                    ))
                  )}
                </div>
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
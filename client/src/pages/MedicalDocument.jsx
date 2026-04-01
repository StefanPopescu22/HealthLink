import { useEffect, useState, useMemo } from "react";
import { 
  FaFileLines, 
  FaShieldHalved, 
  FaDownload, 
  FaTrash, 
  FaFolderOpen, 
  FaUserDoctor, 
  FaHospital, 
  FaUpload
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/MedicalDocuments.css";

function MedicalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    file: null,
  });

  const loadData = async () => {
    setError("");
    try {
      setLoading(true);
      const response = await api.get("/documents/my");
      setDocuments(Array.isArray(response.data) ? response.data : []);
    } catch {
      setError("Failed to load medical documents. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    return {
      total: documents.length,
      recent: documents.filter(d => new Date(d.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length
    };
  }, [documents]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "file") {
      setFormData((prev) => ({ ...prev, file: e.target.files[0] || null }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.title || !formData.category || !formData.file) {
      setError("Please fill in all fields and select a file.");
      return;
    }

    try {
      setUploading(true);
      const patientUserId = JSON.parse(localStorage.getItem("user"))?.id;
      const payload = new FormData();
      payload.append("patientUserId", patientUserId);
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("file", formData.file);

      const response = await api.post("/documents/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(response.data.message || "Document uploaded successfully.");
      setFormData({ title: "", category: "", file: null });
      document.getElementById("fileInput").value = "";
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (documentId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    setError("");
    try {
      const response = await api.delete(`/documents/${documentId}`);
      setSuccess(response.data.message || "Document deleted successfully.");
      await loadData();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete document.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />

          <div className="dashboard-page-content">
            <section className="documents-page">
              
              <section className="documents-hero">
                <div className="documents-hero-content glass-panel">
                  <div className="documents-badge">
                    <FaShieldHalved />
                    <span>Personal Health Vault</span>
                  </div>
                  <h1 className="documents-title">
                    Medical <span className="gradient-text">Documents</span>
                  </h1>
                  <p className="documents-subtitle">
                    Upload, organize, and securely store your medical history, prescriptions, and health certificates in one centralized vault.
                  </p>
                </div>

                <div className="documents-side-card glass-panel">
                  <div className="documents-side-header">
                    <span>Vault Overview</span>
                    <span className="documents-side-pill">Encrypted</span>
                  </div>
                  <div className="documents-side-stats">
                    <div className="documents-stat-item">
                      <span className="documents-stat-label">Total Files</span>
                      <strong>{stats.total}</strong>
                      <small>stored securely</small>
                    </div>
                    <div className="documents-stat-item">
                      <span className="documents-stat-label">Added Recently</span>
                      <strong>{stats.recent}</strong>
                      <small>last 30 days</small>
                    </div>
                  </div>
                </div>
              </section>

              <section className="documents-upload-form-card glass-panel">
                <div className="documents-form-heading">
                  <h2>Add to Vault</h2>
                  <p>Upload a new medical document to your personal health record.</p>
                </div>

                <form className="documents-upload-form" onSubmit={handleUpload}>
                  <div className="documents-upload-group">
                    <label htmlFor="title">Document Title</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="e.g., Cardiology Consultation Report"
                    />
                  </div>

                  <div className="documents-upload-group">
                    <label htmlFor="category">Category</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                    >
                      <option value="">Select category...</option>
                      <option value="Prescription">Prescription</option>
                      <option value="Medical Letter">Medical Letter</option>
                      <option value="Discharge Summary">Discharge Summary</option>
                      <option value="Vaccination Record">Vaccination Record</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="documents-upload-group full">
                    <label htmlFor="fileInput">Select File (PDF, JPG, PNG)</label>
                    <input
                      type="file"
                      id="fileInput"
                      name="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="documents-upload-group full">
                    <button type="submit" className="primary-btn documents-upload-btn" disabled={uploading}>
                      <FaUpload /> {uploading ? "Uploading..." : "Upload Document"}
                    </button>
                  </div>
                </form>

                {error && <div className="documents-message error">{error}</div>}
                {success && <div className="documents-message success">{success}</div>}
              </section>

              <section className="documents-list-section">
                <div className="documents-section-heading">
                  <h2>Your Uploaded Documents</h2>
                  <span className="documents-count-pill">{documents.length} Files</span>
                </div>

                <div className="documents-list">
                  {loading ? (
                    <div className="document-skeleton"></div>
                  ) : documents.length === 0 ? (
                    <div className="documents-empty-state glass-panel">
                      <div className="documents-empty-icon">
                        <FaFolderOpen />
                      </div>
                      <h3>Vault is empty</h3>
                      <p>You haven't uploaded any documents yet. Use the form above to securely store your files.</p>
                    </div>
                  ) : (
                    documents.map((doc) => (
                      <article className="document-card glass-panel" key={doc.id}>
                        <div className="document-icon-box">
                          <FaFileLines />
                        </div>

                        <div className="document-content">
                          <h3>{doc.title}</h3>
                          <div className="document-category">{doc.category || "Uncategorized"}</div>
                          
                          <div className="document-meta">
                            {doc.clinic_name && (
                              <span className="document-meta-chip">
                                <FaHospital /> {doc.clinic_name}
                              </span>
                            )}
                            {doc.doctor_first_name && (
                              <span className="document-meta-chip">
                                <FaUserDoctor /> Dr. {doc.doctor_first_name} {doc.doctor_last_name}
                              </span>
                            )}
                            {doc.created_by_first_name && (
                              <span className="document-meta-chip">
                                Added by: {doc.created_by_first_name} ({doc.created_by_role})
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="document-actions">
                          <a
                            href={`http://localhost:5000${doc.file_path}`}
                            target="_blank"
                            rel="noreferrer"
                            className="document-download-btn"
                          >
                            <FaDownload /> View File
                          </a>
                          <button 
                            className="document-delete-btn"
                            onClick={() => handleDelete(doc.id)}
                          >
                            <FaTrash /> Remove
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

export default MedicalDocuments;
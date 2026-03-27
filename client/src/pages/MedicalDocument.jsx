import { useEffect, useState } from "react";
import {
  FaDownload,
  FaFileLines,
  FaMagnifyingGlass,
  FaShieldHeart,
  FaTrash,
  FaUpload,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/MedicalDocuments.css";

const BACKEND_URL = "http://localhost:5000";

function MedicalDocuments() {
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    file: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadDocuments = async () => {
    try {
      const response = await api.get("/documents/my");
      setDocuments(response.data);
    } catch (err) {
      setError("Failed to load documents.");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "file") {
      setFormData((prev) => ({
        ...prev,
        file: files[0] || null,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("file", formData.file);

      const response = await api.post("/documents", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(response.data.message || "Document uploaded successfully.");
      setFormData({ title: "", category: "", file: null });

      const fileInput = document.getElementById("medical-document-file");
      if (fileInput) fileInput.value = "";

      await loadDocuments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    }
  };

  const handleDelete = async (documentId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/documents/${documentId}`);
      setSuccess(response.data.message || "Document deleted successfully.");
      await loadDocuments();
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
                <div className="documents-hero-content">
                  <div className="documents-badge">
                    <FaShieldHeart />
                    <span>Protected medical file storage</span>
                  </div>

                  <h1 className="documents-title">
                    Your <span className="gradient-text">medical documents</span>
                  </h1>

                  <p className="documents-subtitle">
                    Upload and manage your real medical documents.
                  </p>
                </div>

                <div className="documents-side-card soft-card">
                  <div className="documents-search-box">
                    <FaMagnifyingGlass />
                    <input type="text" placeholder="Documents are shown from live data" disabled />
                  </div>
                </div>
              </section>

              <section className="soft-card documents-upload-form-card">
                <h2>Upload New Document</h2>
                <p>Add a real document file to your medical account.</p>

                <form className="documents-upload-form" onSubmit={handleUpload}>
                  <div className="documents-upload-group">
                    <label>Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Document title"
                    />
                  </div>

                  <div className="documents-upload-group">
                    <label>Category</label>
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      placeholder="Example: Prescription, Medical Report"
                    />
                  </div>

                  <div className="documents-upload-group full">
                    <label>File</label>
                    <input
                      id="medical-document-file"
                      name="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="documents-upload-group full">
                    <button type="submit" className="primary-btn documents-upload-btn">
                      <FaUpload />
                      Upload Document
                    </button>
                  </div>
                </form>

                {error && <p className="documents-message error">{error}</p>}
                {success && <p className="documents-message success">{success}</p>}
              </section>

              <section className="documents-grid">
                {documents.length === 0 && <p>No uploaded documents yet.</p>}

                {documents.map((doc) => (
                  <article className="soft-card document-card" key={doc.id}>
                    <div className="document-icon-box">
                      <FaFileLines />
                    </div>

                    <div className="document-content">
                      <h2>{doc.title}</h2>
                      <p>{doc.category}</p>

                      <div className="document-meta">
                        <span>{doc.uploaded_at}</span>
                        <span>{doc.file_name}</span>
                      </div>
                    </div>

                    <div className="document-actions">
                      <a
                        href={`${BACKEND_URL}${doc.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-btn"
                      >
                        <FaDownload />
                        Download
                      </a>

                      <button
                        className="secondary-btn danger-btn"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
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
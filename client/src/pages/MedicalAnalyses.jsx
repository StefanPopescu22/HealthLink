import { useEffect, useState } from "react";
import {
  FaDownload,
  FaFileMedical,
  FaMagnifyingGlass,
  FaNotesMedical,
  FaShieldHeart,
  FaTrash,
  FaUpload,
} from "react-icons/fa6";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import "../styles/MedicalAnalyses.css";

const BACKEND_URL = "http://localhost:5000";

function MedicalAnalyses() {
  const [analyses, setAnalyses] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    analysisType: "",
    labName: "",
    resultStatus: "available",
    file: null,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadAnalyses = async () => {
    try {
      const response = await api.get("/analyses/my");
      setAnalyses(response.data);
    } catch (err) {
      setError("Failed to load analyses.");
    }
  };

  useEffect(() => {
    loadAnalyses();
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
      payload.append("analysisType", formData.analysisType);
      payload.append("labName", formData.labName);
      payload.append("resultStatus", formData.resultStatus);
      payload.append("file", formData.file);

      const response = await api.post("/analyses", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setSuccess(response.data.message || "Analysis uploaded successfully.");
      setFormData({
        title: "",
        analysisType: "",
        labName: "",
        resultStatus: "available",
        file: null,
      });

      const fileInput = document.getElementById("medical-analysis-file");
      if (fileInput) fileInput.value = "";

      await loadAnalyses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload analysis.");
    }
  };

  const handleDelete = async (analysisId) => {
    setError("");
    setSuccess("");

    try {
      const response = await api.delete(`/analyses/${analysisId}`);
      setSuccess(response.data.message || "Analysis deleted successfully.");
      await loadAnalyses();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete analysis.");
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
                <div className="analyses-hero-content">
                  <div className="analyses-badge">
                    <FaShieldHeart />
                    <span>Smart analysis management</span>
                  </div>

                  <h1 className="analyses-title">
                    Access your <span className="gradient-text">medical analyses</span>
                  </h1>

                  <p className="analyses-subtitle">
                    Upload and manage real laboratory files and analysis entries.
                  </p>
                </div>

                <div className="analyses-side-card soft-card">
                  <div className="analyses-search-box">
                    <FaMagnifyingGlass />
                    <input type="text" placeholder="Analyses are shown from live data" disabled />
                  </div>
                </div>
              </section>

              <section className="soft-card analyses-upload-form-card">
                <h2>Upload New Analysis</h2>
                <p>Add a real analysis file to your medical history.</p>

                <form className="analyses-upload-form" onSubmit={handleUpload}>
                  <div className="analyses-upload-group">
                    <label>Title</label>
                    <input
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Analysis title"
                    />
                  </div>

                  <div className="analyses-upload-group">
                    <label>Analysis Type</label>
                    <input
                      name="analysisType"
                      value={formData.analysisType}
                      onChange={handleChange}
                      placeholder="Example: Biochemistry"
                    />
                  </div>

                  <div className="analyses-upload-group">
                    <label>Laboratory Name</label>
                    <input
                      name="labName"
                      value={formData.labName}
                      onChange={handleChange}
                      placeholder="Laboratory name"
                    />
                  </div>

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

                  <div className="analyses-upload-group full">
                    <label>File</label>
                    <input
                      id="medical-analysis-file"
                      name="file"
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={handleChange}
                    />
                  </div>

                  <div className="analyses-upload-group full">
                    <button type="submit" className="primary-btn analyses-upload-btn">
                      <FaUpload />
                      Upload Analysis
                    </button>
                  </div>
                </form>

                {error && <p className="analyses-message error">{error}</p>}
                {success && <p className="analyses-message success">{success}</p>}
              </section>

              <section className="analyses-grid">
                {analyses.length === 0 && <p>No uploaded analyses yet.</p>}

                {analyses.map((item) => (
                  <article className="soft-card analysis-card" key={item.id}>
                    <div className="analysis-icon-box">
                      <FaNotesMedical />
                    </div>

                    <div className="analysis-content">
                      <h2>{item.title}</h2>
                      <p>{item.analysis_type}</p>

                      <div className="analysis-meta">
                        <span>{item.lab_name || "No lab name"}</span>
                        <span className={`analysis-result ${item.result_status.toLowerCase()}`}>
                          {item.result_status}
                        </span>
                      </div>
                    </div>

                    <div className="document-actions">
                      <a
                        href={`${BACKEND_URL}${item.file_path}`}
                        target="_blank"
                        rel="noreferrer"
                        className="secondary-btn"
                      >
                        <FaDownload />
                        Download
                      </a>

                      <button
                        className="secondary-btn danger-btn"
                        onClick={() => handleDelete(item.id)}
                      >
                        <FaTrash />
                        Delete
                      </button>
                    </div>
                  </article>
                ))}
              </section>

              <section className="analyses-summary">
                <article className="soft-card analyses-summary-card">
                  <div className="analysis-summary-icon">
                    <FaFileMedical />
                  </div>
                  <h3>{analyses.length} Total Analyses</h3>
                  <p>Stored in your digital healthcare archive.</p>
                </article>

                <article className="soft-card analyses-summary-card">
                  <div className="analysis-summary-icon">
                    <FaNotesMedical />
                  </div>
                  <h3>Live Data</h3>
                  <p>All uploaded analyses are loaded from your backend.</p>
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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaFileMedical,
  FaNotesMedical,
  FaUpload,
  FaPen,
  FaCheck,
  FaXmark,
  FaUser,
  FaFolderOpen,
  FaFlask,
  FaTag,
  FaLayerGroup,
} from "react-icons/fa6";
import "../styles/ClinicPatientFiles.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const initials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "P";

function ClinicPatientFiles() {
  const { patientUserId } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [documentForm, setDocumentForm] = useState({ title: "", category: "", file: null });
  const [analysisForm, setAnalysisForm] = useState({
    title: "", analysisType: "", labName: "", resultStatus: "", file: null,
  });

  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [editingDocumentForm, setEditingDocumentForm] = useState({ title: "", category: "", file: null });

  const [editingAnalysisId, setEditingAnalysisId] = useState(null);
  const [editingAnalysisForm, setEditingAnalysisForm] = useState({
    title: "", analysisType: "", labName: "", resultStatus: "", file: null,
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/clinic/patients/${patientUserId}/files`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patient files.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadFiles(); }, [patientUserId]);

  const setDF = (field, value) => setDocumentForm((p) => ({ ...p, [field]: value }));
  const setAF = (field, value) => setAnalysisForm((p) => ({ ...p, [field]: value }));
  const setEDF = (field, value) => setEditingDocumentForm((p) => ({ ...p, [field]: value }));
  const setEAF = (field, value) => setEditingAnalysisForm((p) => ({ ...p, [field]: value }));

  const uploadDocument = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!documentForm.title || !documentForm.file) {
      setError("Document title and file are required.");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("patientUserId", patientUserId);
      payload.append("title", documentForm.title);
      payload.append("category", documentForm.category);
      payload.append("file", documentForm.file);
      const res = await api.post("/documents/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(res.data.message || "Document uploaded.");
      setDocumentForm({ title: "", category: "", file: null });
      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload document.");
    }
  };

  const uploadAnalysis = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!analysisForm.title || !analysisForm.file) {
      setError("Analysis title and file are required.");
      return;
    }
    try {
      const payload = new FormData();
      payload.append("patientUserId", patientUserId);
      payload.append("title", analysisForm.title);
      payload.append("analysisType", analysisForm.analysisType);
      payload.append("labName", analysisForm.labName);
      payload.append("resultStatus", analysisForm.resultStatus);
      payload.append("file", analysisForm.file);
      const res = await api.post("/analyses/upload", payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(res.data.message || "Analysis uploaded.");
      setAnalysisForm({ title: "", analysisType: "", labName: "", resultStatus: "", file: null });
      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to upload analysis.");
    }
  };

  const startEditDocument = (doc) => {
    setEditingDocumentId(doc.id);
    setEditingDocumentForm({ title: doc.title || "", category: doc.category || "", file: null });
  };

  const saveEditedDocument = async (documentId) => {
    setError(""); setSuccess("");
    try {
      const payload = new FormData();
      payload.append("title", editingDocumentForm.title);
      payload.append("category", editingDocumentForm.category);
      if (editingDocumentForm.file) payload.append("file", editingDocumentForm.file);
      const res = await api.put(`/documents/${documentId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(res.data.message || "Document updated.");
      setEditingDocumentId(null);
      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update document.");
    }
  };

  const startEditAnalysis = (analysis) => {
    setEditingAnalysisId(analysis.id);
    setEditingAnalysisForm({
      title: analysis.title || "",
      analysisType: analysis.analysis_type || "",
      labName: analysis.lab_name || "",
      resultStatus: analysis.result_status || "",
      file: null,
    });
  };

  const saveEditedAnalysis = async (analysisId) => {
    setError(""); setSuccess("");
    try {
      const payload = new FormData();
      payload.append("title", editingAnalysisForm.title);
      payload.append("analysisType", editingAnalysisForm.analysisType);
      payload.append("labName", editingAnalysisForm.labName);
      payload.append("resultStatus", editingAnalysisForm.resultStatus);
      if (editingAnalysisForm.file) payload.append("file", editingAnalysisForm.file);
      const res = await api.put(`/analyses/${analysisId}`, payload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess(res.data.message || "Analysis updated.");
      setEditingAnalysisId(null);
      await loadFiles();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update analysis.");
    }
  };

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="clinic-patient-files-page">

              {loading && !data && (
                <div className="clinic-patient-files-header">
                  <div className="clinic-patient-header-left">
                    <div className="clinic-patient-avatar">P</div>
                    <div className="clinic-patient-header-info">
                      <div className="clinic-files-skeleton" style={{ width: 200, height: 28, borderRadius: 8 }} />
                    </div>
                  </div>
                </div>
              )}

              {error && !data && (
                <p className="clinic-patient-files-message error"><FaXmark /> {error}</p>
              )}

              {data && (
                <>
                  <div className="clinic-patient-files-header">
                    <div className="clinic-patient-header-left">
                      <div className="clinic-patient-avatar">
                        {initials(data.patient.first_name, data.patient.last_name)}
                      </div>
                      <div className="clinic-patient-header-info">
                        <div className="clinic-patient-badge">
                          <FaUser />
                          Patient Record
                        </div>
                        <h1>{data.patient.first_name} {data.patient.last_name}</h1>
                        <p>{data.patient.email}</p>
                      </div>
                    </div>

                    <div className="clinic-patient-header-right">
                      <div className="clinic-patient-stat">
                        <strong>{data.documents.length}</strong>
                        <span>Documents</span>
                      </div>
                      <div className="clinic-patient-stat">
                        <strong>{data.analyses.length}</strong>
                        <span>Analyses</span>
                      </div>
                    </div>
                  </div>

                  {error   && <p className="clinic-patient-files-message error"><FaXmark /> {error}</p>}
                  {success && <p className="clinic-patient-files-message success"><FaCheck /> {success}</p>}

                  <div className="clinic-patient-upload-grid">
                    <form className="clinic-patient-files-card" onSubmit={uploadDocument}>
                      <div className="clinic-files-card-heading">
                        <h2><FaFileMedical /> Upload Document</h2>
                        <p>Add a medical document to this patient's record.</p>
                      </div>

                      <div className="clinic-form-group">
                        <label>Document Title *</label>
                        <input
                          type="text"
                          value={documentForm.title}
                          onChange={(e) => setDF("title", e.target.value)}
                          placeholder="e.g. Discharge Summary, Prescription..."
                        />
                      </div>

                      <div className="clinic-form-group">
                        <label>Category</label>
                        <input
                          type="text"
                          value={documentForm.category}
                          onChange={(e) => setDF("category", e.target.value)}
                          placeholder="e.g. Cardiology, General..."
                        />
                      </div>

                      <div className="clinic-form-group">
                        <label>File (PDF, JPG, PNG) *</label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setDF("file", e.target.files[0] || null)}
                        />
                      </div>

                      <button type="submit" className="primary-btn clinic-upload-btn">
                        <FaUpload /> Upload Document
                      </button>
                    </form>

                    <form className="clinic-patient-files-card" onSubmit={uploadAnalysis}>
                      <div className="clinic-files-card-heading">
                        <h2><FaNotesMedical /> Upload Analysis</h2>
                        <p>Add a laboratory result or analysis file.</p>
                      </div>

                      <div className="clinic-form-group">
                        <label>Analysis Title *</label>
                        <input
                          type="text"
                          value={analysisForm.title}
                          onChange={(e) => setAF("title", e.target.value)}
                          placeholder="e.g. Complete Blood Count..."
                        />
                      </div>

                      <div className="clinic-form-group">
                        <label>Analysis Type</label>
                        <input
                          type="text"
                          value={analysisForm.analysisType}
                          onChange={(e) => setAF("analysisType", e.target.value)}
                          placeholder="e.g. Biochemistry, Haematology..."
                        />
                      </div>

                      <div className="clinic-form-group">
                        <label>Lab Name</label>
                        <input
                          type="text"
                          value={analysisForm.labName}
                          onChange={(e) => setAF("labName", e.target.value)}
                          placeholder="e.g. Synevo, Medlife Lab..."
                        />
                      </div>

                      <div className="clinic-form-group">
                        <label>Result Status</label>
                        <input
                          type="text"
                          value={analysisForm.resultStatus}
                          onChange={(e) => setAF("resultStatus", e.target.value)}
                          placeholder="e.g. available, reviewed..."
                        />
                      </div>

                      <div className="clinic-form-group">
                        <label>File (PDF, JPG, PNG) *</label>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setAF("file", e.target.files[0] || null)}
                        />
                      </div>

                      <button type="submit" className="primary-btn clinic-upload-btn">
                        <FaUpload /> Upload Analysis
                      </button>
                    </form>
                  </div>

                  <div className="clinic-patient-files-grid">
                    <div className="clinic-patient-files-section">
                      <div className="clinic-files-section-header">
                        <h2><FaFileMedical /> Documents</h2>
                        <span className="clinic-files-count-pill">{data.documents.length}</span>
                      </div>

                      <div className="clinic-patient-files-list">
                        {data.documents.length === 0 ? (
                          <div className="clinic-files-empty">
                            <FaFileMedical />
                            <span>No documents uploaded yet.</span>
                          </div>
                        ) : (
                          data.documents.map((doc) => (
                            <div className="clinic-patient-file-item" key={doc.id}>
                              {editingDocumentId === doc.id ? (
                                <div className="clinic-patient-file-edit-form">
                                  <div className="clinic-edit-form-title">
                                    <FaPen /> Editing document
                                  </div>
                                  <input
                                    type="text"
                                    value={editingDocumentForm.title}
                                    onChange={(e) => setEDF("title", e.target.value)}
                                    placeholder="Document title"
                                  />
                                  <input
                                    type="text"
                                    value={editingDocumentForm.category}
                                    onChange={(e) => setEDF("category", e.target.value)}
                                    placeholder="Category"
                                  />
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setEDF("file", e.target.files[0] || null)}
                                  />
                                  <div className="clinic-edit-form-actions">
                                    <button className="clinic-edit-save-btn" onClick={() => saveEditedDocument(doc.id)}>
                                      <FaCheck /> Save
                                    </button>
                                    <button className="clinic-edit-cancel-btn" onClick={() => setEditingDocumentId(null)}>
                                      <FaXmark /> Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="clinic-file-item-top">
                                    <div className="clinic-file-item-icon"><FaFileMedical /></div>
                                    <div className="clinic-file-item-info">
                                      <h3>{doc.title}</h3>
                                      <div className="clinic-file-chips">
                                        {doc.category && (
                                          <span className="clinic-file-chip">
                                            <FaTag /> {doc.category}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {doc.created_by_first_name && (
                                    <p className="clinic-file-item-uploader">
                                      <FaUser />
                                      {doc.created_by_first_name} {doc.created_by_last_name}
                                      {doc.created_by_role ? ` · ${doc.created_by_role}` : ""}
                                    </p>
                                  )}
                                  <div className="clinic-file-item-actions">
                                    <a
                                      href={`${BACKEND_URL}${doc.file_path}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="clinic-file-open-btn"
                                    >
                                      <FaFolderOpen /> Open
                                    </a>
                                    <button className="clinic-file-edit-btn" onClick={() => startEditDocument(doc)}>
                                      <FaPen /> Edit
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="clinic-patient-files-section">
                      <div className="clinic-files-section-header">
                        <h2><FaNotesMedical /> Analyses</h2>
                        <span className="clinic-files-count-pill">{data.analyses.length}</span>
                      </div>

                      <div className="clinic-patient-files-list">
                        {data.analyses.length === 0 ? (
                          <div className="clinic-files-empty">
                            <FaNotesMedical />
                            <span>No analyses uploaded yet.</span>
                          </div>
                        ) : (
                          data.analyses.map((analysis) => (
                            <div className="clinic-patient-file-item" key={analysis.id}>
                              {editingAnalysisId === analysis.id ? (
                                <div className="clinic-patient-file-edit-form">
                                  <div className="clinic-edit-form-title">
                                    <FaPen /> Editing analysis
                                  </div>
                                  <input
                                    type="text"
                                    value={editingAnalysisForm.title}
                                    onChange={(e) => setEAF("title", e.target.value)}
                                    placeholder="Analysis title"
                                  />
                                  <input
                                    type="text"
                                    value={editingAnalysisForm.analysisType}
                                    onChange={(e) => setEAF("analysisType", e.target.value)}
                                    placeholder="Analysis type"
                                  />
                                  <input
                                    type="text"
                                    value={editingAnalysisForm.labName}
                                    onChange={(e) => setEAF("labName", e.target.value)}
                                    placeholder="Lab name"
                                  />
                                  <input
                                    type="text"
                                    value={editingAnalysisForm.resultStatus}
                                    onChange={(e) => setEAF("resultStatus", e.target.value)}
                                    placeholder="Result status"
                                  />
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => setEAF("file", e.target.files[0] || null)}
                                  />
                                  <div className="clinic-edit-form-actions">
                                    <button className="clinic-edit-save-btn" onClick={() => saveEditedAnalysis(analysis.id)}>
                                      <FaCheck /> Save
                                    </button>
                                    <button className="clinic-edit-cancel-btn" onClick={() => setEditingAnalysisId(null)}>
                                      <FaXmark /> Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="clinic-file-item-top">
                                    <div className="clinic-file-item-icon"><FaNotesMedical /></div>
                                    <div className="clinic-file-item-info">
                                      <h3>{analysis.title}</h3>
                                      <div className="clinic-file-chips">
                                        {analysis.analysis_type && (
                                          <span className="clinic-file-chip">
                                            <FaFlask /> {analysis.analysis_type}
                                          </span>
                                        )}
                                        {analysis.lab_name && (
                                          <span className="clinic-file-chip">
                                            <FaLayerGroup /> {analysis.lab_name}
                                          </span>
                                        )}
                                        {analysis.result_status && (
                                          <span className={`clinic-file-chip chip-status-${analysis.result_status.toLowerCase()}`}>
                                            {analysis.result_status}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  {analysis.created_by_first_name && (
                                    <p className="clinic-file-item-uploader">
                                      <FaUser />
                                      {analysis.created_by_first_name} {analysis.created_by_last_name}
                                      {analysis.created_by_role ? ` · ${analysis.created_by_role}` : ""}
                                    </p>
                                  )}
                                  <div className="clinic-file-item-actions">
                                    <a
                                      href={`${BACKEND_URL}${analysis.file_path}`}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="clinic-file-open-btn"
                                    >
                                      <FaFolderOpen /> Open
                                    </a>
                                    <button className="clinic-file-edit-btn" onClick={() => startEditAnalysis(analysis)}>
                                      <FaPen /> Edit
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default ClinicPatientFiles;
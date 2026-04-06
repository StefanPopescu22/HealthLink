import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardSidebar from "../components/DashboardSidebar";
import Footer from "../components/Footer";
import api from "../services/api";
import {
  FaUserDoctor,
  FaUser,
  FaNotesMedical,
  FaFileMedical,
  FaCalendarDays,
  FaPhone,
  FaDroplet,
  FaTriangleExclamation,
  FaCheck,
  FaXmark,
  FaPen,
  FaUpload,
  FaFolderOpen,
  FaFlask,
  FaLayerGroup,
  FaTag,
  FaClock,
} from "react-icons/fa6";
import "../styles/DoctorPatientDetails.css";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const initials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "P";

const formatDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch { return d; }
};

function DoctorPatientDetails() {
  const { patientUserId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [noteForm, setNoteForm] = useState({ appointmentId: "", noteText: "", recommendationText: "" });
  const [documentForm, setDocumentForm] = useState({ title: "", category: "", file: null });
  const [analysisForm, setAnalysisForm] = useState({ title: "", analysisType: "", labName: "", resultStatus: "", file: null });

  const [editingDocumentId, setEditingDocumentId] = useState(null);
  const [editingDocumentForm, setEditingDocumentForm] = useState({ title: "", category: "", file: null });

  const [editingAnalysisId, setEditingAnalysisId] = useState(null);
  const [editingAnalysisForm, setEditingAnalysisForm] = useState({ title: "", analysisType: "", labName: "", resultStatus: "", file: null });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadPatientDetails = async () => {
    try {
      const res = await api.get(`/doctor/patients/${patientUserId}`);
      setData(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load patient details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadPatientDetails(); }, [patientUserId]);

  const fileChange = (setter) => (e) => {
    const { name, value, files } = e.target;
    setter((p) => ({ ...p, [name]: name === "file" ? (files?.[0] || null) : value }));
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      const res = await api.post(`/doctor/patients/${patientUserId}/notes`, noteForm);
      setSuccess(res.data.message || "Medical note added.");
      setNoteForm({ appointmentId: "", noteText: "", recommendationText: "" });
      await loadPatientDetails();
    } catch (err) { setError(err.response?.data?.message || "Failed to add medical note."); }
  };

  const handleUploadDocument = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!documentForm.title || !documentForm.file) { setError("Document title and file are required."); return; }
    try {
      const payload = new FormData();
      payload.append("patientUserId", patientUserId);
      payload.append("title", documentForm.title);
      payload.append("category", documentForm.category);
      payload.append("file", documentForm.file);
      const res = await api.post("/documents/upload", payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(res.data.message || "Document uploaded.");
      setDocumentForm({ title: "", category: "", file: null });
      await loadPatientDetails();
    } catch (err) { setError(err.response?.data?.message || "Failed to upload document."); }
  };

  const handleSaveDocument = async (documentId) => {
    setError(""); setSuccess("");
    try {
      const payload = new FormData();
      payload.append("title", editingDocumentForm.title);
      payload.append("category", editingDocumentForm.category);
      if (editingDocumentForm.file) payload.append("file", editingDocumentForm.file);
      const res = await api.put(`/documents/${documentId}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(res.data.message || "Document updated.");
      setEditingDocumentId(null);
      await loadPatientDetails();
    } catch (err) { setError(err.response?.data?.message || "Failed to update document."); }
  };

  const handleUploadAnalysis = async (e) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!analysisForm.title || !analysisForm.file) { setError("Analysis title and file are required."); return; }
    try {
      const payload = new FormData();
      payload.append("patientUserId", patientUserId);
      payload.append("title", analysisForm.title);
      payload.append("analysisType", analysisForm.analysisType);
      payload.append("labName", analysisForm.labName);
      payload.append("resultStatus", analysisForm.resultStatus);
      payload.append("file", analysisForm.file);
      const res = await api.post("/analyses/upload", payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(res.data.message || "Analysis uploaded.");
      setAnalysisForm({ title: "", analysisType: "", labName: "", resultStatus: "", file: null });
      await loadPatientDetails();
    } catch (err) { setError(err.response?.data?.message || "Failed to upload analysis."); }
  };

  const handleSaveAnalysis = async (analysisId) => {
    setError(""); setSuccess("");
    try {
      const payload = new FormData();
      payload.append("title", editingAnalysisForm.title);
      payload.append("analysisType", editingAnalysisForm.analysisType);
      payload.append("labName", editingAnalysisForm.labName);
      payload.append("resultStatus", editingAnalysisForm.resultStatus);
      if (editingAnalysisForm.file) payload.append("file", editingAnalysisForm.file);
      const res = await api.put(`/analyses/${analysisId}`, payload, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(res.data.message || "Analysis updated.");
      setEditingAnalysisId(null);
      await loadPatientDetails();
    } catch (err) { setError(err.response?.data?.message || "Failed to update analysis."); }
  };

  if (loading && !data) {
    return (
      <>
        <main className="dashboard-screen">
          <div className="page-container dashboard-shell-grid">
            <DashboardSidebar />
            <div className="dashboard-page-content">
              <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="doc-skeleton" style={{ height: 120, borderRadius: "var(--radius-xl)" }} />
                <div className="doc-skeleton" style={{ height: 200, opacity: 0.6, borderRadius: "var(--radius-xl)" }} />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (error && !data) {
    return (
      <>
        <main className="dashboard-screen">
          <div className="page-container dashboard-shell-grid">
            <DashboardSidebar />
            <div className="dashboard-page-content">
              <p className="doctor-note-message error"><FaXmark /> {error}</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const p = data.patient;

  return (
    <>
      <main className="dashboard-screen">
        <div className="page-container dashboard-shell-grid">
          <DashboardSidebar />
          <div className="dashboard-page-content">
            <section className="doctor-patient-details-page">

              <div className="doctor-patient-details-header">
                <div className="doc-patient-header-left">
                  <div className="doc-patient-avatar">{initials(p.first_name, p.last_name)}</div>
                  <div className="doc-patient-header-info">
                    <div className="doc-patient-badge"><FaUserDoctor /> Patient Record</div>
                    <h1>{p.first_name} {p.last_name}</h1>
                    <p>{p.email}</p>
                  </div>
                </div>
                <div className="doc-patient-header-stats">
                  <div className="doc-patient-stat">
                    <strong>{data.appointments?.length || 0}</strong>
                    <span>Appointments</span>
                  </div>
                  <div className="doc-patient-stat">
                    <strong>{data.notes?.length || 0}</strong>
                    <span>Notes</span>
                  </div>
                  <div className="doc-patient-stat">
                    <strong>{(data.documents?.length || 0) + (data.analyses?.length || 0)}</strong>
                    <span>Files</span>
                  </div>
                </div>
              </div>

              {error   && <p className="doctor-note-message error"><FaXmark /> {error}</p>}
              {success && <p className="doctor-note-message success"><FaCheck /> {success}</p>}

              <div className="doctor-patient-details-grid">
                <article className="doctor-patient-section">
                  <div className="doctor-section-heading">
                    <div className="doctor-section-icon"><FaUser /></div>
                    <div><h2>Patient Information</h2><p>Medical and contact details.</p></div>
                  </div>
                  <div className="patient-info-grid">
                    {[
                      { label: "Phone",            value: p.phone },
                      { label: "Date of Birth",    value: formatDate(p.date_of_birth) },
                      { label: "Gender",           value: p.gender },
                      { label: "Blood Group",      value: p.blood_group },
                      { label: "Emergency Contact",value: p.emergency_contact_name },
                      { label: "Emergency Phone",  value: p.emergency_contact_phone },
                      { label: "Medical Notes",    value: p.medical_notes },
                    ].map(({ label, value }) => (
                      <div className="patient-info-row" key={label}>
                        <strong>{label}</strong>
                        <span>{value || "Not set"}</span>
                      </div>
                    ))}
                    <div className="patient-info-row">
                      <strong>Allergies</strong>
                      {data.allergies?.length > 0 ? (
                        <div className="allergy-chips">
                          {data.allergies.map((a) => (
                            <span key={a.allergy_name} className="allergy-chip">
                              <FaTriangleExclamation /> {a.allergy_name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span>No allergies listed</span>
                      )}
                    </div>
                  </div>
                </article>

                <article className="doctor-patient-section">
                  <div className="doctor-section-heading">
                    <div className="doctor-section-icon"><FaNotesMedical /></div>
                    <div><h2>Add Medical Note</h2><p>Link to an appointment or create a standalone note.</p></div>
                  </div>
                  <form className="doctor-note-form" onSubmit={handleAddNote}>
                    <div className="doc-form-group">
                      <label>Appointment (optional)</label>
                      <select name="appointmentId" value={noteForm.appointmentId} onChange={fileChange(setNoteForm)}>
                        <option value="">No appointment link</option>
                        {data.appointments?.map((item) => (
                          <option key={item.id} value={item.id}>
                            {formatDate(item.appointment_date)} {item.appointment_time?.slice(0, 5)} — {item.status}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="doc-form-group">
                      <label>Medical Note *</label>
                      <textarea name="noteText" value={noteForm.noteText} onChange={fileChange(setNoteForm)} placeholder="Write the medical observation..." />
                    </div>
                    <div className="doc-form-group">
                      <label>Recommendation</label>
                      <textarea name="recommendationText" value={noteForm.recommendationText} onChange={fileChange(setNoteForm)} placeholder="Write follow-up recommendations..." />
                    </div>
                    <button type="submit" className="primary-btn doc-submit-btn">
                      <FaCheck /> Save Medical Note
                    </button>
                  </form>
                </article>
              </div>

              <div className="doctor-patient-files-upload-grid">
                <form className="doctor-patient-section" onSubmit={handleUploadDocument}>
                  <div className="doctor-section-heading">
                    <div className="doctor-section-icon"><FaFileMedical /></div>
                    <div><h2>Upload Document</h2><p>Add a medical document to the patient's record.</p></div>
                  </div>
                  <div className="doc-form-group"><label>Title *</label>
                    <input type="text" name="title" value={documentForm.title} onChange={fileChange(setDocumentForm)} placeholder="e.g. Discharge Summary..." />
                  </div>
                  <div className="doc-form-group"><label>Category</label>
                    <input type="text" name="category" value={documentForm.category} onChange={fileChange(setDocumentForm)} placeholder="e.g. Cardiology, General..." />
                  </div>
                  <div className="doc-form-group"><label>File (PDF, JPG, PNG) *</label>
                    <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={fileChange(setDocumentForm)} />
                  </div>
                  <button type="submit" className="primary-btn doc-submit-btn"><FaUpload /> Upload Document</button>
                </form>

                <form className="doctor-patient-section" onSubmit={handleUploadAnalysis}>
                  <div className="doctor-section-heading">
                    <div className="doctor-section-icon"><FaFlask /></div>
                    <div><h2>Upload Analysis</h2><p>Add a laboratory result or analysis file.</p></div>
                  </div>
                  <div className="doc-form-group"><label>Title *</label>
                    <input type="text" name="title" value={analysisForm.title} onChange={fileChange(setAnalysisForm)} placeholder="e.g. Complete Blood Count..." />
                  </div>
                  <div className="doc-form-group"><label>Analysis Type</label>
                    <input type="text" name="analysisType" value={analysisForm.analysisType} onChange={fileChange(setAnalysisForm)} placeholder="e.g. Biochemistry..." />
                  </div>
                  <div className="doc-form-group"><label>Lab Name</label>
                    <input type="text" name="labName" value={analysisForm.labName} onChange={fileChange(setAnalysisForm)} placeholder="e.g. Synevo, Medlife..." />
                  </div>
                  <div className="doc-form-group"><label>Result Status</label>
                    <input type="text" name="resultStatus" value={analysisForm.resultStatus} onChange={fileChange(setAnalysisForm)} placeholder="e.g. available, reviewed..." />
                  </div>
                  <div className="doc-form-group"><label>File (PDF, JPG, PNG) *</label>
                    <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={fileChange(setAnalysisForm)} />
                  </div>
                  <button type="submit" className="primary-btn doc-submit-btn"><FaUpload /> Upload Analysis</button>
                </form>
              </div>

              <article className="doctor-patient-section">
                <div className="doctor-section-heading">
                  <div className="doctor-section-icon"><FaNotesMedical /></div>
                  <div><h2>Medical Notes History</h2><p>{data.notes?.length || 0} notes recorded.</p></div>
                  
                </div>
                <div className="doctor-patient-notes-list">
                  {!data.notes?.length ? (
                    <div className="doc-notes-empty"><FaNotesMedical /><span>No medical notes added yet.</span></div>
                  ) : (
                    data.notes.map((note) => (
                      <div className="doctor-patient-note-item" key={note.id}>
                        <div className="note-item-header">
                          <span className="note-item-date"><FaCalendarDays />{formatDate(note.created_at)}</span>
                        </div>
                        {note.note_text && (
                          <div className="note-item-field">
                            <strong>Note</strong>
                            <p>{note.note_text}</p>
                          </div>
                        )}
                        {note.recommendation_text && (
                          <div className="note-item-field">
                            <strong>Recommendation</strong>
                            <p>{note.recommendation_text}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </article>

              <div className="doctor-patient-details-grid">
                <article className="doctor-patient-section">
                  <div className="doctor-section-heading">
                    <div className="doctor-section-icon"><FaFileMedical /></div>
                    <div><h2>Documents</h2><p>{data.documents?.length || 0} files on record.</p></div>
                  </div>
                  <div className="doctor-patient-notes-list">
                    {!data.documents?.length ? (
                      <div className="doc-files-empty"><FaFileMedical /><span>No documents uploaded yet.</span></div>
                    ) : (
                      data.documents.map((doc) => (
                        <div className="doctor-patient-note-item" key={doc.id}>
                          {editingDocumentId === doc.id ? (
                            <div className="doctor-file-edit-form">
                              <div className="doc-edit-title"><FaPen /> Editing document</div>
                              <input type="text" name="title" value={editingDocumentForm.title} onChange={fileChange(setEditingDocumentForm)} placeholder="Document title" />
                              <input type="text" name="category" value={editingDocumentForm.category} onChange={fileChange(setEditingDocumentForm)} placeholder="Category" />
                              <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={fileChange(setEditingDocumentForm)} />
                              <div className="doc-edit-actions">
                                <button className="doc-edit-save" onClick={() => handleSaveDocument(doc.id)}><FaCheck /> Save</button>
                                <button className="doc-edit-cancel" onClick={() => setEditingDocumentId(null)}><FaXmark /> Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="doc-item-header">
                                <div className="doc-item-icon"><FaFileMedical /></div>
                                <div className="doc-item-info">
                                  <h3>{doc.title}</h3>
                                  <div className="doc-item-chips">
                                    {doc.category && <span className="doc-item-chip"><FaTag /> {doc.category}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="doc-item-actions">
                                <a href={`${BACKEND_URL}${doc.file_path}`} target="_blank" rel="noreferrer" className="doc-open-btn">
                                  <FaFolderOpen /> Open
                                </a>
                                <button className="doc-edit-btn" onClick={() => { setEditingDocumentId(doc.id); setEditingDocumentForm({ title: doc.title || "", category: doc.category || "", file: null }); }}>
                                  <FaPen /> Edit
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </article>

                <article className="doctor-patient-section">
                  <div className="doctor-section-heading">
                    <div className="doctor-section-icon"><FaFlask /></div>
                    <div><h2>Analyses</h2><p>{data.analyses?.length || 0} results on record.</p></div>
                  </div>
                  <div className="doctor-patient-notes-list">
                    {!data.analyses?.length ? (
                      <div className="doc-files-empty"><FaFlask /><span>No analyses uploaded yet.</span></div>
                    ) : (
                      data.analyses.map((analysis) => (
                        <div className="doctor-patient-note-item" key={analysis.id}>
                          {editingAnalysisId === analysis.id ? (
                            <div className="doctor-file-edit-form">
                              <div className="doc-edit-title"><FaPen /> Editing analysis</div>
                              <input type="text" name="title" value={editingAnalysisForm.title} onChange={fileChange(setEditingAnalysisForm)} placeholder="Analysis title" />
                              <input type="text" name="analysisType" value={editingAnalysisForm.analysisType} onChange={fileChange(setEditingAnalysisForm)} placeholder="Analysis type" />
                              <input type="text" name="labName" value={editingAnalysisForm.labName} onChange={fileChange(setEditingAnalysisForm)} placeholder="Lab name" />
                              <input type="text" name="resultStatus" value={editingAnalysisForm.resultStatus} onChange={fileChange(setEditingAnalysisForm)} placeholder="Result status" />
                              <input type="file" name="file" accept=".pdf,.jpg,.jpeg,.png" onChange={fileChange(setEditingAnalysisForm)} />
                              <div className="doc-edit-actions">
                                <button className="doc-edit-save" onClick={() => handleSaveAnalysis(analysis.id)}><FaCheck /> Save</button>
                                <button className="doc-edit-cancel" onClick={() => setEditingAnalysisId(null)}><FaXmark /> Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="doc-item-header">
                                <div className="doc-item-icon"><FaFlask /></div>
                                <div className="doc-item-info">
                                  <h3>{analysis.title}</h3>
                                  <div className="doc-item-chips">
                                    {analysis.analysis_type && <span className="doc-item-chip"><FaLayerGroup /> {analysis.analysis_type}</span>}
                                    {analysis.lab_name && <span className="doc-item-chip"><FaTag /> {analysis.lab_name}</span>}
                                    {analysis.result_status && <span className={`doc-item-chip ${analysis.result_status === "reviewed" ? "chip-reviewed" : ""}`}>{analysis.result_status}</span>}
                                  </div>
                                </div>
                              </div>
                              <div className="doc-item-actions">
                                <a href={`${BACKEND_URL}${analysis.file_path}`} target="_blank" rel="noreferrer" className="doc-open-btn">
                                  <FaFolderOpen /> Open
                                </a>
                                <button className="doc-edit-btn" onClick={() => { setEditingAnalysisId(analysis.id); setEditingAnalysisForm({ title: analysis.title || "", analysisType: analysis.analysis_type || "", labName: analysis.lab_name || "", resultStatus: analysis.result_status || "", file: null }); }}>
                                  <FaPen /> Edit
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </article>
              </div>

            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default DoctorPatientDetails;
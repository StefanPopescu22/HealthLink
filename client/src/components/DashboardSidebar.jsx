import { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaCalendarCheck,
  FaChartLine,
  FaClipboardCheck,
  FaFileMedical,
  FaHospital,
  FaNotesMedical,
  FaRobot,
  FaStethoscope,
  FaUserDoctor,
  FaUserGroup,
  FaUserShield,
  FaUser,
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import "../styles/DashboardSidebar.css";

function DashboardSidebar() {
  const { user } = useContext(AuthContext);

  const patientLinks = [
    { to: "/dashboard-patient", label: "Overview", icon: <FaChartLine /> },
    { to: "/appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { to: "/medical-documents", label: "Documents", icon: <FaFileMedical /> },
    { to: "/medical-analyses", label: "Analyses", icon: <FaNotesMedical /> },
    { to: "/clinics", label: "Clinics", icon: <FaHospital /> },
    { to: "/chatbot", label: "AI Assistant", icon: <FaRobot /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const doctorLinks = [
    { to: "/dashboard-doctor", label: "Overview", icon: <FaChartLine /> },
    { to: "/dashboard-doctor", label: "Schedule", icon: <FaCalendarCheck /> },
    { to: "/dashboard-doctor", label: "Patients", icon: <FaUserGroup /> },
    { to: "/dashboard-doctor", label: "Medical Notes", icon: <FaNotesMedical /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const clinicLinks = [
    { to: "/dashboard-clinic", label: "Overview", icon: <FaChartLine /> },
    { to: "/clinic/create-doctor", label: "Create Doctor", icon: <FaUserDoctor /> },
    { to: "/clinic-profile", label: "Clinic Profile", icon: <FaHospital /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const adminLinks = [
    { to: "/admin", label: "Overview", icon: <FaChartLine /> },
    { to: "/admin/create-clinic", label: "Create Clinic", icon: <FaClipboardCheck /> },
    { to: "/admin/create-doctor", label: "Create Doctor", icon: <FaUserDoctor /> },
    { to: "/clinics", label: "Clinics", icon: <FaHospital /> },
    { to: "/doctors", label: "Doctors", icon: <FaUserShield /> },
    { to: "/services", label: "Services", icon: <FaStethoscope /> },
  ];

  const linksByRole = {
    patient: patientLinks,
    doctor: doctorLinks,
    clinic: clinicLinks,
    admin: adminLinks,
  };

  const currentLinks = linksByRole[user?.role] || [];

  return (
    <aside className="dashboard-sidebar-card soft-card">
      <div className="dashboard-sidebar-top">
        <h3>Workspace</h3>
        <p>{user?.role ? `${user.role.charAt(0).toUpperCase()}${user.role.slice(1)} access` : "User area"}</p>
      </div>

      <nav className="dashboard-sidebar-nav">
        {currentLinks.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "dashboard-sidebar-link active" : "dashboard-sidebar-link"
            }
          >
            <span className="dashboard-sidebar-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="dashboard-sidebar-bottom">
        <strong>HealthLink</strong>
        <span>Connected medical workspace</span>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
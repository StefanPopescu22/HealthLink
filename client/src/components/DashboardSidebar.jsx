import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
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
  FaArrowRightFromBracket,
  FaHeartPulse,
} from "react-icons/fa6";
import { AuthContext } from "../context/AuthContext";
import "../styles/DashboardSidebar.css";

const ROLE_CONFIG = {
  patient: {
    label: "Patient",
    color: "#2563eb",
    bg: "rgba(37,99,235,0.08)",
    border: "rgba(37,99,235,0.18)",
  },
  doctor: {
    label: "Doctor",
    color: "#059669",
    bg: "rgba(5,150,105,0.08)",
    border: "rgba(5,150,105,0.18)",
  },
  clinic: {
    label: "Clinic",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.18)",
  },
  admin: {
    label: "Administrator",
    color: "#dc2626",
    bg: "rgba(220,38,38,0.08)",
    border: "rgba(220,38,38,0.18)",
  },
};

const patientLinks = [
  { to: "/dashboard-patient", label: "Overview",    icon: <FaChartLine /> },
  { to: "/appointments",      label: "Appointments", icon: <FaCalendarCheck /> },
  { to: "/medical-documents", label: "Documents",   icon: <FaFileMedical /> },
  { to: "/medical-analyses",  label: "Analyses",    icon: <FaNotesMedical /> },
  { to: "/favorites",         label: "Favorites",   icon: <FaHospital /> },
  { to: "/chatbot",           label: "AI Assistant",icon: <FaRobot /> },
  { to: "/profile",           label: "Profile",     icon: <FaUser /> },
];

const doctorLinks = [
  { to: "/dashboard-doctor",     label: "Overview",     icon: <FaChartLine /> },
  { to: "/doctor/appointments",  label: "Appointments", icon: <FaCalendarCheck /> },
  { to: "/doctor/patients",      label: "Patients",     icon: <FaUserGroup /> },
  { to: "/profile",              label: "Profile",      icon: <FaUser /> },
];

const clinicLinks = [
  { to: "/dashboard-clinic",      label: "Overview",        icon: <FaChartLine /> },
  { to: "/clinic/appointments",   label: "Appointments",    icon: <FaCalendarCheck /> },
  { to: "/clinic/create-doctor",  label: "Create Doctor",   icon: <FaUserDoctor /> },
  { to: "/clinic/manage-doctors", label: "Manage Doctors",  icon: <FaStethoscope /> },
  { to: "/clinic/services",       label: "Services",        icon: <FaNotesMedical /> },
  { to: "/profile",               label: "Profile",         icon: <FaUser /> },
];

const adminLinks = [
  { to: "/admin",                 label: "Overview",         icon: <FaChartLine /> },
  { to: "/admin/create-clinic",   label: "Create Clinic",    icon: <FaClipboardCheck /> },
  { to: "/admin/create-doctor",   label: "Create Doctor",    icon: <FaUserDoctor /> },
  { to: "/admin/manage-doctors",  label: "Manage Doctors",   icon: <FaUserDoctor /> },
  { to: "/admin/users",           label: "Manage Users",     icon: <FaUserShield /> },
  { to: "/admin/services",        label: "Services Catalog", icon: <FaNotesMedical /> },
  { to: "/admin/specialties",     label: "Manage Specialties",      icon: <FaStethoscope /> },
  { to: "/clinics",               label: "Clinics",          icon: <FaHospital /> },
  { to: "/doctors",               label: "Doctors",          icon: <FaUserShield /> },
];

const linksByRole = { patient: patientLinks, doctor: doctorLinks, clinic: clinicLinks, admin: adminLinks };

function DashboardSidebar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const roleConfig = ROLE_CONFIG[user?.role] || ROLE_CONFIG.patient;
  const currentLinks = linksByRole[user?.role] || [];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const avatarInitials = user
    ? `${(user.firstName || user.first_name || "U").charAt(0)}${(user.lastName || user.last_name || "").charAt(0)}`.toUpperCase()
    : "U";

  return (
    <aside className="dashboard-sidebar-card">
      <div className="sidebar-header">
        <div className="sidebar-brand">
          <div className="sidebar-brand-icon">
            <FaHeartPulse />
          </div>
          <div>
            <strong>HealthLink</strong>
            <span>Medical workspace</span>
          </div>
        </div>
      </div>

      <div className="sidebar-user">
        <div className="sidebar-avatar">
          {avatarInitials}
        </div>
        <div className="sidebar-user-info">
          <strong>
            {user?.firstName || user?.first_name || user?.name || "User"}
            {user?.lastName || user?.last_name ? ` ${user.lastName || user.last_name}` : ""}
          </strong>
          <span
            className="sidebar-role-badge"
            style={{
              color: roleConfig.color,
              background: roleConfig.bg,
              borderColor: roleConfig.border,
            }}
          >
            {roleConfig.label}
          </span>
        </div>
      </div>

      <nav className="dashboard-sidebar-nav">
        <span className="sidebar-nav-label">Navigation</span>
        {currentLinks.map((item, index) => (
          <NavLink
            key={index}
            to={item.to}
            end={item.to === "/dashboard-patient" || item.to === "/admin" || item.to === "/dashboard-doctor" || item.to === "/dashboard-clinic"}
            className={({ isActive }) =>
              isActive ? "dashboard-sidebar-link active" : "dashboard-sidebar-link"
            }
          >
            <span className="dashboard-sidebar-icon">{item.icon}</span>
            <span className="sidebar-link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="dashboard-sidebar-bottom">
        <button className="sidebar-logout-btn" onClick={handleLogout}>
          <FaArrowRightFromBracket />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

export default DashboardSidebar;
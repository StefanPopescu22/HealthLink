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
    { to: "/favorites", label: "Favorites", icon: <FaHospital /> },
    { to: "/clinics", label: "Clinics", icon: <FaHospital /> },
    { to: "/chatbot", label: "AI Assistant", icon: <FaRobot /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const doctorLinks = [
    { to: "/dashboard-doctor", label: "Overview", icon: <FaChartLine /> },
    { to: "/doctor/appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { to: "/doctor/patients", label: "Patients", icon: <FaUserGroup /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const clinicLinks = [
    { to: "/dashboard-clinic", label: "Overview", icon: <FaChartLine /> },
    { to: "/clinic/appointments", label: "Appointments", icon: <FaCalendarCheck /> },
    { to: "/clinic/create-doctor", label: "Create Doctor", icon: <FaUserDoctor /> },
    { to: "/clinic/manage-doctors", label: "Manage Doctors", icon: <FaStethoscope /> },
    { to: "/clinic/services", label: "Services", icon: <FaNotesMedical /> },
    { to: "/clinic-profile", label: "Clinic Profile", icon: <FaHospital /> },
    { to: "/profile", label: "Profile", icon: <FaUser /> },
  ];

  const adminLinks = [
    { to: "/admin", label: "Overview", icon: <FaChartLine /> },
    { to: "/admin/create-clinic", label: "Create Clinic", icon: <FaClipboardCheck /> },
    { to: "/admin/create-doctor", label: "Create Doctor", icon: <FaUserDoctor /> },
    { to: "/admin/users", label: "Manage Users", icon: <FaUserShield /> },
    { to: "/admin/services", label: "Services Catalog", icon: <FaNotesMedical /> },
    { to: "/admin/specialties", label: "Specialties", icon: <FaStethoscope /> },
    { to: "/clinics", label: "Clinics", icon: <FaHospital /> },
    { to: "/doctors", label: "Doctors", icon: <FaUserShield /> },
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
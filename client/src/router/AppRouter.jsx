import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Clinics from "../pages/Clinics";
import ClinicProfile from "../pages/ClinicProfile";
import DoctorProfile from "../pages/DoctorProfile";
import Chatbot from "../pages/Chatbot";
import DashboardPatient from "../pages/DashboardPatient";
import DashboardDoctor from "../pages/DashboardDoctor";
import DashboardClinic from "../pages/DashboardClinic";
import AdminPanel from "../pages/AdminPanel";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/clinics" element={<Clinics />} />
        <Route path="/clinic-profile" element={<ClinicProfile />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/chatbot" element={<Chatbot />} />

        <Route
          path="/dashboard-patient"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <DashboardPatient />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/dashboard-doctor"
          element={
            <RoleProtectedRoute allowedRoles={["doctor"]}>
              <DashboardDoctor />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/dashboard-clinic"
          element={
            <RoleProtectedRoute allowedRoles={["clinic"]}>
              <DashboardClinic />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminPanel />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <div>Profile Page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
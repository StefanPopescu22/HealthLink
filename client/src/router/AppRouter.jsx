import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import ProtectedRoute from "../components/ProtectedRoute";
import RoleProtectedRoute from "../components/RoleProtectedRoute";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
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
              <div>Profil utilizator</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
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
import Doctors from "../pages/Doctors";
import Services from "../pages/Services";
import Specialties from "../pages/Specialties";
import Chatbot from "../pages/Chatbot";
import DashboardPatient from "../pages/DashboardPatient";
import DashboardDoctor from "../pages/DashboardDoctor";
import DashboardClinic from "../pages/DashboardClinic";
import AdminPanel from "../pages/AdminPanel";
import Appointments from "../pages/Appointments";
import MedicalDocuments from "../pages/MedicalDocument";
import MedicalAnalyses from "../pages/MedicalAnalyses";
import Profile from "../pages/Profile";
import NotFound from "../pages/NotFound";
import AdminCreateClinic from "../pages/AdminCreateClinic";
import AdminCreateDoctor from "../pages/AdminCreateDoctor";
import ClinicCreateDoctor from "../pages/ClinicCreateDoctor";
import DoctorPatients from "../pages/DoctorPatients";
import DoctorPatientDetails from "../pages/DoctorPatientDetails";
import ClinicManageDoctors from "../pages/ClinicManageDoctors";
import AdminUsers from "../pages/AdminUsers";
import PatientFavorites from "../pages/PatientFavorites";
import DoctorAppointments from "../pages/DoctorAppointments";
import ClinicAppointments from "../pages/ClinicAppointments";
import ClinicServices from "../pages/ClinicServices";
import AdminServices from "../pages/AdminServices";
import AdminSpecialties from "../pages/AdminSpecialties";
import AdminManageDoctors from "../pages/AdminManageDoctors";
import ClinicPatientFiles from "../pages/ClinicPatientFiles";
import AboutUs from "../pages/AboutUs";
import FAQ from "../pages/FAQ";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/clinics" element={<Clinics />} />
        <Route path="/clinics/:id" element={<ClinicProfile />} />

        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/:id" element={<DoctorProfile />} />

        <Route path="/clinic-profile" element={<ClinicProfile />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />

        <Route path="/services" element={<Services />} />
        <Route path="/specialties" element={<Specialties />} />
        <Route path="/chatbot" element={<Chatbot />} />
        
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq"   element={<FAQ />} />

        <Route
          path="/clinic/patients/:patientUserId/files"
          element={
            <RoleProtectedRoute allowedRoles={["clinic"]}>  
              <ClinicPatientFiles />
            </RoleProtectedRoute>
          }
        />  

        <Route
          path="/admin/manage-doctors"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminManageDoctors />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/doctor/appointments"
          element={
            <RoleProtectedRoute allowedRoles={["doctor"]}>
              <DoctorAppointments />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/clinic/appointments"
          element={
            <RoleProtectedRoute allowedRoles={["clinic"]}>
              <ClinicAppointments />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/clinic/services"
          element={
            <RoleProtectedRoute allowedRoles={["clinic"]}>
              <ClinicServices />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/services"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminServices />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/specialties"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminSpecialties />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/favorites"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <PatientFavorites />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/doctor/patients"
          element={
            <RoleProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPatients />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/doctor/patients/:patientUserId"
          element={
            <RoleProtectedRoute allowedRoles={["doctor"]}>
              <DoctorPatientDetails />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/clinic/manage-doctors"
          element={
            <RoleProtectedRoute allowedRoles={["clinic"]}>
              <ClinicManageDoctors />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </RoleProtectedRoute>
          }
        />

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
          path="/appointments"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <Appointments />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/medical-documents"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <MedicalDocuments />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/medical-analyses"
          element={
            <RoleProtectedRoute allowedRoles={["patient"]}>
              <MedicalAnalyses />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-clinic"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminCreateClinic />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/admin/create-doctor"
          element={
            <RoleProtectedRoute allowedRoles={["admin"]}>
              <AdminCreateDoctor />
            </RoleProtectedRoute>
          }
        />

        <Route
          path="/clinic/create-doctor"
          element={
            <RoleProtectedRoute allowedRoles={["clinic"]}>
              <ClinicCreateDoctor />
            </RoleProtectedRoute>
          }
        />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
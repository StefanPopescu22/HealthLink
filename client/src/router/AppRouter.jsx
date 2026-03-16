import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "../components/Navbar";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Clinics from "../pages/Clinics";
import DoctorProfile from "../pages/DoctorProfile";
import ClinicProfile from "../pages/ClinicProfile";
import Chatbot from "../pages/Chatbot";

function AppRouter() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/clinics" element={<Clinics />} />
        <Route path="/doctor-profile" element={<DoctorProfile />} />
        <Route path="/clinic-profile" element={<ClinicProfile />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
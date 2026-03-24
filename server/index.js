const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const clinicRoutes = require("./routes/clinicRoutes");
const metaRoutes = require("./routes/metaRoutes");
const publicRoutes = require("./routes/publicRoutes");
const profileRoutes = require("./routes/profileRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const documentRoutes = require("./routes/documentRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const healthRoutes = require("./routes/healthRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/health", healthRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/clinic", clinicRoutes);
app.use("/api/meta", metaRoutes);
app.use("/api/public", publicRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/analyses", analysisRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe portul ${PORT}`);
});
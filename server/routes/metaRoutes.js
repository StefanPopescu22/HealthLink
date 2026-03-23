const express = require("express");
const router = express.Router();

const { getSpecialties } = require("../controllers/metaController");

router.get("/specialties", getSpecialties);

module.exports = router;
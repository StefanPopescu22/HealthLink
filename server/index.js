const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("HealthLink API merge corect");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Serverul ruleaza pe portul ${PORT}`);
});
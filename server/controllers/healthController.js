const getHealthStatus = (req, res) => {
  res.json({
    success: true,
    message: "HealthLink API functioneaza corect",
  });
};

module.exports = { getHealthStatus };
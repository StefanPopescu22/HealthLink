const db = require("../config/db");

const listSpecialties = async () => {
  const [rows] = await db.execute(
    `SELECT id, name, description
     FROM specialties
     ORDER BY name ASC`
  );

  return rows;
};

module.exports = {
  listSpecialties,
};
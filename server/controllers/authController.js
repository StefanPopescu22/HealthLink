const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  findUserByEmail,
  findUserById,
  createUser,
} = require("../models/userModel");

const signToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );
};

const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: "Toate campurile obligatorii trebuie completate." });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: "Exista deja un cont cu acest email." });
    }

    // Pentru demo/test poti lasa selectie de rol.
    // Pentru varianta finala, schimba in: const finalRole = "patient";
    const allowedRoles = ["patient", "doctor", "clinic", "admin"];
    const finalRole = allowedRoles.includes(role) ? role : "patient";

    const passwordHash = await bcrypt.hash(password, 10);

    const userId = await createUser({
      firstName,
      lastName,
      email,
      passwordHash,
      role: finalRole,
    });

    const user = await findUserById(userId);
    const token = signToken(user);

    return res.status(201).json({
      message: "Cont creat cu succes.",
      token,
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Eroare la inregistrare.", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Emailul si parola sunt obligatorii." });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Email sau parola incorecta." });
    }

    if (user.is_blocked) {
      return res.status(403).json({ message: "Contul este blocat." });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Email sau parola incorecta." });
    }

    const safeUser = await findUserById(user.id);
    const token = signToken(safeUser);

    return res.status(200).json({
      message: "Autentificare reusita.",
      token,
      user: safeUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Eroare la autentificare.", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "Utilizatorul nu a fost gasit." });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({ message: "Eroare la preluarea utilizatorului.", error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
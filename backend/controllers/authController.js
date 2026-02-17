
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// REGISTER
exports.register = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifie si l'email existe déjà
    const existing = await pool.query(
      'SELECT * FROM auth WHERE email=$1', [email]
    );
    if (existing.rows.length > 0) {
      return res.status(400).json({ error: 'Email déjà utilisé' });
    }

    // Hash le password
    const hashed = await bcrypt.hash(password, 10);

    // Crée l'utilisateur
    const result = await pool.query(
      'INSERT INTO auth (email, password) VALUES ($1, $2) RETURNING id, email',
      [email, hashed]
    );

    // Génère le token
    const token = jwt.sign(
      { userId: result.rows[0].id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token, email: result.rows[0].email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Cherche l'utilisateur
    const result = await pool.query(
      'SELECT * FROM auth WHERE email=$1', [email]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    const user = result.rows[0];

    // Vérifie le password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
    }

    // Génère le token
    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
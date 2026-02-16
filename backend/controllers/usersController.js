
const pool = require('../db');

// GET
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
exports.createUser = async (req, res) => {
  const { photo, nom, prenom, description } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO users (photo, nom, prenom, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [photo, nom, prenom, description]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { photo, nom, prenom, description } = req.body;

  try {
    const result = await pool.query(
      'UPDATE users SET photo=$1, nom=$2, prenom=$3, description=$4 WHERE id=$5 RETURNING *',
      [photo, nom, prenom, description, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

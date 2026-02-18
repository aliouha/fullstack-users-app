const pool = require('../db');

// GET - tout le monde peut voir
exports.getUsers = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE - users ne peuvent créer qu'une seule card
exports.createUser = async (req, res) => {
  const { photo, nom, prenom, description } = req.body;

  try {
    // Vérifie le rôle
    const authUser = await pool.query('SELECT role, user_card_id FROM auth WHERE id=$1', [req.userId]);
    
    if (authUser.rows[0].role !== 'admin' && authUser.rows[0].user_card_id) {
      return res.status(403).json({ error: 'Vous avez déjà créé votre card' });
    }

    const result = await pool.query(
      'INSERT INTO users (photo, nom, prenom, description) VALUES ($1, $2, $3, $4) RETURNING *',
      [photo, nom, prenom, description]
    );

    // Si user (pas admin), lie la card à son compte
    if (authUser.rows[0].role !== 'admin') {
      await pool.query('UPDATE auth SET user_card_id=$1 WHERE id=$2', [result.rows[0].id, req.userId]);
    }

    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE - vérifié par middleware
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

// DELETE - vérifié par middleware
exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Si user supprime sa card, reset user_card_id
    await pool.query('UPDATE auth SET user_card_id=NULL WHERE user_card_id=$1', [id]);
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
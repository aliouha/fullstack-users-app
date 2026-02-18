const pool = require('../db');

exports.isAdmin = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT role FROM auth WHERE id=$1', [req.userId]);
    if (result.rows[0]?.role === 'admin') {
      return next();
    }
    res.status(403).json({ error: 'Admin uniquement' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.checkOwnership = async (req, res, next) => {
  try {
    const authUser = await pool.query('SELECT role, user_card_id FROM auth WHERE id=$1', [req.userId]);
    
    if (authUser.rows[0].role === 'admin') {
      return next(); // Admin peut tout faire
    }

    const cardId = parseInt(req.params.id || req.body.id);
    
    if (authUser.rows[0].user_card_id !== cardId) {
      return res.status(403).json({ error: 'Vous ne pouvez modifier que votre propre card' });
    }
    
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
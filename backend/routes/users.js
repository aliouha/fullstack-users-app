const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

// Route publique : GET tous les utilisateurs (accessible sans token)
router.get('/', getUsers);

// Routes protégées (nécessitent un token valide)
router.post('/', auth, createUser);
router.put('/:id', auth, updateUser);
router.delete('/:id', auth, deleteUser);

module.exports = router;
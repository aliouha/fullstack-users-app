const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { checkOwnership } = require('../middleware/checkRole');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

router.get('/', getUsers);  // Public
router.post('/', auth, createUser);  // Auth requis
router.put('/:id', auth, checkOwnership, updateUser);  // Auth + ownership
router.delete('/:id', auth, checkOwnership, deleteUser);  // Auth + ownership

module.exports = router;
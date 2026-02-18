const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const { checkOwnership } = require('../middleware/checkRole');
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser
} = require('../controllers/usersController');

router.get('/', getUsers);
router.post('/', auth, upload.single('photo'), createUser);
router.put('/:id', auth, checkOwnership, upload.single('photo'), updateUser);
router.delete('/:id', auth, checkOwnership, deleteUser);

module.exports = router;
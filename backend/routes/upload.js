const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', upload.single('photo'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier reçu' });
  }
  const photoUrl = `http://192.168.1.14/uploads/${req.file.filename}`;
  res.json({ url: photoUrl });
});

module.exports = router;
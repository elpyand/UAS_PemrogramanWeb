const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const { nama, avatar } = req.query; // Ambil dari query string
  res.render('chatbot', {
    nama: nama || 'Piki',
    avatar: avatar || '/image/avatar.jpg'
  });
});

module.exports = router;

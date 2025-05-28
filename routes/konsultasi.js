const express = require('express');
const router = express.Router();

// Route untuk halaman konsultasi
router.get('/', (req, res) => {
    res.render('konsultasi'); // pastikan ada konsultasi.ejs di folder views
});

module.exports = router;
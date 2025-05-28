const express = require('express');
const app = express();
const port = 3000;

// Set view engine EJS
app.set('view engine', 'ejs');

// Middleware
app.use(express.urlencoded({ extended: true })); // Biar bisa baca form POST
app.use(express.static('public')); // Folder public buat CSS/gambar
app.use('/uploads', express.static('uploads')); // Buat akses file bukti upload

// Import route
const laporinRoute = require('./routes/laporin');
const jejakkuRoute = require('./routes/jejakku');
const konsultasiRouter = require('./routes/konsultasi');
const chatbotRouter = require('./routes/chatbot');
const edukasiRouter = require('./routes/edukasi');

// Gunakan route
app.use('/', laporinRoute);
app.use('/', jejakkuRoute);
app.use('/konsultasi', konsultasiRouter);
app.use('/chatbot', chatbotRouter);
app.use('/edukasi', edukasiRouter);


// Routing halaman utama
app.get('/', (req, res) => {
    res.render('index', { title: 'Home Page' });
});

// Jalankan server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

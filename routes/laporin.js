const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const mysql = require('mysql2/promise');

// Koneksi Database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_laporan'
});

// Setup multer untuk upload file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Generate ID Jejakku
function generateIdJejakku() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Generate ID Laporan
function generateIdLaporan() {
    return 'LAPOR-' + Math.floor(10000000 + Math.random() * 90000000).toString();
}

// Tampil halaman form laporin
router.get('/laporin', (req, res) => {
    res.render('laporin', {
        laporanBerhasil: false,
        idJejakku: null,
        idLaporan: null
    });
});

// Proses simpan laporan
router.post('/laporin', upload.array('bukti', 10), async (req, res) => {
    const { nama, alamat, umur, deskripsi, tindakan } = req.body;
    const files = req.files;

    let id_jejakku = req.body.id_jejakku || generateIdJejakku(); // generate baru jika tidak ada
    const id_laporan = generateIdLaporan();

    try {
        // Simpan ID Jejakku baru jika belum ada
        if (!req.body.id_jejakku) {
            await db.query('INSERT INTO jejakku (id_jejakku) VALUES (?)', [id_jejakku]);
        }

        // Status tergantung tombol yang ditekan
        const status = (tindakan === 'kirim') ? 'Menunggu Diproses' : 'Draft';

        // Simpan laporan
        await db.query(`
            INSERT INTO laporan (id_laporan, id_jejakku, nama, alamat, umur, deskripsi, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [id_laporan, id_jejakku, nama, alamat, umur, deskripsi, status] // ← jumlah sesuai kolom
        );

        // Simpan file bukti
        if (files && files.length > 0) {
            for (let file of files) {
                await db.query('INSERT INTO bukti (id_laporan, nama_file) VALUES (?, ?)', [id_laporan, file.filename]);
            }
        }

        // Kirim ke halaman sukses dengan ID Jejakku dan ID Laporan
        res.render('laporin', {
            laporanBerhasil: true,
            idJejakku: id_jejakku,
            idLaporan: id_laporan
        });

    } catch (error) {
        console.error(error);
        res.send('Terjadi kesalahan saat menyimpan laporan.');
    }
});

router.post('/update-draft/:id', upload.array('bukti', 10), async (req, res) => {
    const { id } = req.params;
    const { nama, alamat, umur, deskripsi } = req.body;
    const files = req.files;

    try {
        await db.query('UPDATE laporan SET nama=?, alamat=?, umur=?, deskripsi=?, status=? WHERE id_laporan=?', 
        [nama, alamat, umur, deskripsi, 'Menunggu Diproses', id]);

        if (files && files.length > 0) {
            for (let file of files) {
                await db.query('INSERT INTO bukti (id_laporan, nama_file) VALUES (?, ?)', [id, file.filename]);
            }
        }

        res.redirect('/jejakku?id_jejakku=' + req.body.id_jejakku);
    } catch (error) {
        console.error(error);
        res.send('Gagal mengupdate laporan');
    }
});


module.exports = router;

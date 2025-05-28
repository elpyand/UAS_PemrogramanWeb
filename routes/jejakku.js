const express = require('express');
const router = express.Router();
const mysql = require('mysql2/promise');
const multer = require('multer');

// Koneksi database
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'db_laporan'
});

// Setup Muller
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'uploads/'); // folder upload bukti
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, uniqueSuffix + '-' + file.originalname);
    }
  });
  
  const upload = multer({ storage: storage });

// Tampil halaman jejakku
router.get('/jejakku', async (req, res) => {
    const id_jejakku = req.query.id_jejakku;

    if (!id_jejakku) {
        // Tampilkan form input ID Jejakku
        return res.render('input_id');
    }

    try {
        const [laporan] = await db.query('SELECT * FROM laporan WHERE id_jejakku = ?', [id_jejakku]);
        res.render('jejakku', { laporan, id_jejakku });
    } catch (err) {
        console.error(err);
        res.send('Terjadi kesalahan.');
    }
});


// Update laporan (edit dan kirim dari draft)
router.post('/update-draft/:id', upload.array('bukti', 10), async (req, res) => {
    const id_laporan = req.params.id;
    const { nama, alamat, umur, deskripsi, action, id_jejakku } = req.body;
    const files = req.files;

    try {
        const status = (action === 'kirim') ? 'Menunggu Diproses' : 'Draft';

        // Update laporan
        await db.query('UPDATE laporan SET nama = ?, alamat = ?, umur = ?, deskripsi = ?, status = ? WHERE id_laporan = ?', 
            [nama, alamat, umur, deskripsi, status, id_laporan]);

        // Simpan file baru jika ada
        if (files && files.length > 0) {
            for (let file of files) {
                await db.query('INSERT INTO bukti (id_laporan, nama_file) VALUES (?, ?)', [id_laporan, file.filename]);
            }
        }

        res.redirect('/jejakku?id_jejakku=' + req.query.id_jejakku);
    } catch (error) {
        console.error(error);
        res.send('Gagal update laporan.');
    }
});

// Tambah laporan baru
router.post('/tambah-laporan', upload.array('bukti', 10), async (req, res) => {
    const { id_jejakku, nama, alamat, umur, deskripsi } = req.body;
    const files = req.files;

    try {
        // Insert laporan baru
        const [result] = await db.query(
            'INSERT INTO laporan (id_jejakku, nama, alamat, umur, deskripsi, status) VALUES (?, ?, ?, ?, ?, ?)', 
            [id_jejakku, nama, alamat, umur, deskripsi, 'Menunggu Diproses']
        );

        const id_laporan_baru = result.insertId;

        // Simpan bukti jika ada
        if (files && files.length > 0) {
            for (let file of files) {
                await db.query('INSERT INTO bukti (id_laporan, nama_file) VALUES (?, ?)', [id_laporan_baru, file.filename]);
            }
        }

        res.redirect('/jejakku?id_jejakku=' + id_jejakku);
    } catch (error) {
        console.error(error);
        res.send('Gagal menambahkan laporan.');
    }
});

// Route untuk halaman detail laporan
router.get('/jejak/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Ambil data laporan berdasarkan id
    const [laporanRows] = await db.query('SELECT * FROM laporan WHERE id_laporan = ?', [id]);
    if (laporanRows.length === 0) return res.send('Laporan tidak ditemukan.');

    const laporan = laporanRows[0];

    // Ambil timeline laporan (sesuaikan dengan struktur database kamu)
    const [timelineRows] = await db.query('SELECT * FROM timeline WHERE id_laporan = ? ORDER BY waktu ASC', [id]);

    // Tambahkan data timeline ke objek laporan
    laporan.timeline = timelineRows.map(row => ({
      tahap: row.tahap,
      waktu: new Date(row.waktu).toLocaleString('id-ID'),
      aktif: row.aktif === 1
    }));

    // Ambil catatan petugas (kalau ada)
    const [catatanRows] = await db.query('SELECT * FROM catatan WHERE id_laporan = ? ORDER BY tanggal DESC LIMIT 1', [id]);

    if (catatanRows.length > 0) {
      laporan.catatan = catatanRows[0].isi;
      laporan.petugas = catatanRows[0].petugas;
      laporan.tanggal_catatan = new Date(catatanRows[0].tanggal).toLocaleDateString('id-ID');
    } else {
      laporan.catatan = 'Belum ada catatan';
      laporan.petugas = '-';
      laporan.tanggal_catatan = '-';
    }

    res.render('detail_laporan', { laporan });

  } catch (err) {
    console.error(err);
    res.send('Gagal menampilkan detail laporan.');
  }
});


module.exports = router;

-- Database
CREATE DATABASE IF NOT EXISTS db_laporan;
USE db_laporan;

-- Table jejakku
CREATE TABLE jejakku (
    id_jejakku VARCHAR(50) PRIMARY KEY
);

-- Table laporan
CREATE TABLE laporan (
    id_laporan VARCHAR(50) PRIMARY KEY,
    id_jejakku VARCHAR(50),
    nik VARCHAR(20) NOT NULL,
    nama VARCHAR(100) NOT NULL,
    alamat TEXT NOT NULL,
    umur INT NOT NULL,
    deskripsi TEXT NOT NULL,
    status ENUM('Menunggu Diproses', 'Diproses', 'Draft') DEFAULT 'Draft',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_jejakku) REFERENCES jejakku(id_jejakku) ON DELETE CASCADE
);

-- Table bukti
CREATE TABLE bukti (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_laporan VARCHAR(50),
    nama_file VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_laporan) REFERENCES laporan(id_laporan) ON DELETE CASCADE
);

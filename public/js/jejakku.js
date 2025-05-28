document.addEventListener('DOMContentLoaded', () => {
    const items = document.querySelectorAll('.laporan-item, tbody tr[data-id]');
    const modal = document.getElementById('modal');
    const form = document.getElementById('edit-form');
    const kirimBtn = document.getElementById('kirim-btn');

    const tambahLaporanBtn = document.getElementById('tambah-laporan-btn');
    const modalTambah = document.getElementById('modal-tambah');

    items.forEach(item => {
        item.addEventListener('click', () => {
            const id = item.getAttribute('data-id');
            const nama = item.getAttribute('data-nama');
            const alamat = item.getAttribute('data-alamat');
            const umur = item.getAttribute('data-umur');
            const deskripsi = item.getAttribute('data-deskripsi');
            const status = item.getAttribute('data-status');

            form.action = `/update-draft/${id}`; // Action POST ke endpoint update
            form.nama.value = nama;
            form.alamat.value = alamat;
            form.umur.value = umur;
            form.deskripsi.value = deskripsi;
            document.getElementById('id_laporan').value = id;

            if (status === 'Draft') {
                kirimBtn.style.display = 'inline-block';
                form.querySelector('button[type="submit"]').style.display = 'inline-block';

                form.nama.readOnly = false;
                form.alamat.readOnly = false;
                form.umur.readOnly = false;
                form.deskripsi.readOnly = false;
                form.bukti.disabled = false;
            } else {
                kirimBtn.style.display = 'none';
                form.querySelector('button[type="submit"]').style.display = 'none';

                form.nama.readOnly = true;
                form.alamat.readOnly = true;
                form.umur.readOnly = true;
                form.deskripsi.readOnly = true;
                form.bukti.disabled = true;
            }

            modal.style.display = 'block';
        });
    });

    if (tambahLaporanBtn && modalTambah) {
        tambahLaporanBtn.addEventListener('click', () => {
            modalTambah.style.display = 'block';
        });
    }

    const closeTambahBtn = document.getElementById('close-tambah-btn');
    if (closeTambahBtn) {
        closeTambahBtn.addEventListener('click', () => {
            closeTambahModal();
        });
    }

    kirimBtn.addEventListener('click', () => {
        document.getElementById('action').value = 'kirim';
        form.submit();
    });

    // Menutup modal jika klik luar area
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
        if (e.target === modalTambah) {
            modalTambah.style.display = 'none';
        }
    });
});

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

function closeTambahModal() {
    document.getElementById('modal-tambah').style.display = 'none';
}

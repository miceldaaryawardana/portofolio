/**
 * ==============================================================================
 * PORTOFOLIO PRIBADI - LOGIKA & INTERAKSI (JAVASCRIPT)
 * 
 * Fitur:
 * 1. Mobile Menu Toggle (Buka/Tutup Navigasi di Perangkat Seluler)
 * 2. Active Navigation on Scroll (Scroll Spy)
 * 3. Sticky Header Effect saat di-scroll
 * 4. Formulir Kontak:
 *    - e.preventDefault() untuk mencegah reload halaman
 *    - Validasi format email & input wajib diisi
 *    - Efek loading pada tombol ("Mengirim...")
 *    - Notifikasi Toast Popup & Alert Box Sukses
 *    - Reset form setelah pesan berhasil dikirim
 * 5. Interaksi Tombol "Lihat Detail" pada Proyek
 * 6. Auto Update Tahun Hak Cipta di Footer
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. ELEMEN DOM (Document Object Model)
     -------------------------------------------------------------------------- */
  const header = document.getElementById('header');
  const navMenu = document.getElementById('nav-menu');
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link');
  const currentYearSpan = document.getElementById('current-year');

  // Form Kontak
  const contactForm = document.getElementById('contact-form');
  const nameInput = document.getElementById('name');
  const emailInput = document.getElementById('email');
  const subjectInput = document.getElementById('subject');
  const messageInput = document.getElementById('message');
  const submitBtn = document.getElementById('submit-btn');
  const btnText = submitBtn ? submitBtn.querySelector('.btn-text') : null;
  const spinner = submitBtn ? submitBtn.querySelector('.spinner') : null;
  const formAlert = document.getElementById('form-alert');

  // Toast Notification
  const toast = document.getElementById('toast-notification');
  const toastTitle = document.getElementById('toast-title');
  const toastBody = document.getElementById('toast-body');
  const toastClose = document.getElementById('toast-close');

  // Tombol Lihat Detail Proyek
  const detailButtons = document.querySelectorAll('.view-detail-btn');


  /* --------------------------------------------------------------------------
     2. SET TAHUN FOOTER OTOMATIS
     -------------------------------------------------------------------------- */
  if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
  }


  /* --------------------------------------------------------------------------
     3. TOGGLE MENU NAVIGASI MOBILE
     -------------------------------------------------------------------------- */
  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const icon = menuToggle.querySelector('i');
      if (navMenu.classList.contains('open')) {
        icon.classList.remove('fa-bars-staggered');
        icon.classList.add('fa-xmark');
      } else {
        icon.classList.remove('fa-xmark');
        icon.classList.add('fa-bars-staggered');
      }
    });

    // Tutup menu mobile ketika salah satu tautan diklik
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
          navMenu.classList.remove('open');
          const icon = menuToggle.querySelector('i');
          icon.classList.remove('fa-xmark');
          icon.classList.add('fa-bars-staggered');
        }
      });
    });
  }


  /* --------------------------------------------------------------------------
     4. STICKY HEADER & ACTIVE NAV LINK SAAT SCROLL
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Tambah shadow saat discroll
    if (header) {
      if (scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    // Sorot tautan navigasi sesuai posisi section yang sedang dilihat (Scroll Spy)
    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetNavLink = document.querySelector(`.nav-menu a[href*='${sectionId}']`);

      if (targetNavLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetNavLink.classList.add('active');
        } else {
          targetNavLink.classList.remove('active');
        }
      }
    });
  });


  /* --------------------------------------------------------------------------
     5. FUNGSI VALIDASI FORMULIR KONTAK
     -------------------------------------------------------------------------- */
  
  /**
   * Menampilkan pesan kesalahan pada input tertentu
   * @param {HTMLElement} inputEl - Elemen input
   * @param {string} message - Pesan error yang akan ditampilkan
   */
  const showError = (inputEl, message) => {
    const formGroup = inputEl.closest('.form-group');
    if (!formGroup) return;
    
    formGroup.classList.add('has-error');
    const errorMsgEl = formGroup.querySelector('.error-msg');
    if (errorMsgEl) {
      errorMsgEl.textContent = message;
    }
  };

  /**
   * Menghapus status kesalahan dari input tertentu
   * @param {HTMLElement} inputEl - Elemen input
   */
  const clearError = (inputEl) => {
    const formGroup = inputEl.closest('.form-group');
    if (!formGroup) return;

    formGroup.classList.remove('has-error');
    const errorMsgEl = formGroup.querySelector('.error-msg');
    if (errorMsgEl) {
      errorMsgEl.textContent = '';
    }
  };

  /**
   * Memvalidasi format alamat email
   * @param {string} email - String email
   * @returns {boolean}
   */
  const isValidEmail = (email) => {
    // Regex standar validasi email (memastikan format nama@domain.ekstensi)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  /**
   * Validasi seluruh kolom input form kontak
   * @returns {boolean} - True jika seluruh input valid
   */
  const validateForm = () => {
    let isValid = true;

    // 1. Validasi Nama Lengkap
    if (!nameInput.value.trim()) {
      showError(nameInput, 'Nama lengkap wajib diisi.');
      isValid = false;
    } else if (nameInput.value.trim().length < 2) {
      showError(nameInput, 'Nama harus memiliki minimal 2 karakter.');
      isValid = false;
    } else {
      clearError(nameInput);
    }

    // 2. Validasi Email
    if (!emailInput.value.trim()) {
      showError(emailInput, 'Alamat email wajib diisi.');
      isValid = false;
    } else if (!isValidEmail(emailInput.value)) {
      showError(emailInput, 'Format email tidak valid (contoh: nama@email.com).');
      isValid = false;
    } else {
      clearError(emailInput);
    }

    // 3. Validasi Subjek
    if (!subjectInput.value.trim()) {
      showError(subjectInput, 'Subjek pesan wajib diisi.');
      isValid = false;
    } else if (subjectInput.value.trim().length < 3) {
      showError(subjectInput, 'Subjek harus memiliki minimal 3 karakter.');
      isValid = false;
    } else {
      clearError(subjectInput);
    }

    // 4. Validasi Pesan
    if (!messageInput.value.trim()) {
      showError(messageInput, 'Pesan Anda tidak boleh kosong.');
      isValid = false;
    } else if (messageInput.value.trim().length < 10) {
      showError(messageInput, 'Pesan minimal berisi 10 karakter agar lebih jelas.');
      isValid = false;
    } else {
      clearError(messageInput);
    }

    return isValid;
  };

  // Bersihkan pesan error seketika saat user mulai mengetik (Real-time feedback)
  [nameInput, emailInput, subjectInput, messageInput].forEach(input => {
    if (input) {
      input.addEventListener('input', () => clearError(input));
    }
  });


  /* --------------------------------------------------------------------------
     6. FUNGSI TOAST NOTIFIKASI POP-UP
     -------------------------------------------------------------------------- */
  let toastTimeout;

  /**
   * Memunculkan notifikasi toast di pojok kanan bawah
   * @param {string} title - Judul notifikasi
   * @param {string} message - Pesan notifikasi
   */
  const showToast = (title, message) => {
    if (!toast) return;

    if (toastTitle) toastTitle.textContent = title;
    if (toastBody) toastBody.textContent = message;

    toast.classList.add('show');

    // Hapus timer sebelumnya jika masih aktif
    if (toastTimeout) clearTimeout(toastTimeout);

    // Otomatis tutup toast setelah 5 detik
    toastTimeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 5000);
  };

  if (toastClose && toast) {
    toastClose.addEventListener('click', () => {
      toast.classList.remove('show');
      if (toastTimeout) clearTimeout(toastTimeout);
    });
  }


  /* --------------------------------------------------------------------------
     7. EVENT LISTENER SUBMIT FORM KONTAK
     -------------------------------------------------------------------------- */
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      // Wajib: Cegah reload halaman saat form disubmit
      e.preventDefault();

      // Validasi form
      if (!validateForm()) {
        // Fokuskan ke kolom input error pertama
        const firstError = contactForm.querySelector('.has-error .form-input');
        if (firstError) firstError.focus();
        return;
      }

      // Sembunyikan alert sebelumnya jika ada
      if (formAlert) {
        formAlert.style.display = 'none';
        formAlert.className = 'form-alert';
        formAlert.textContent = '';
      }

      // Tampilkan status "Mengirim..." pada tombol
      submitBtn.disabled = true;
      if (btnText) btnText.style.display = 'none';
      if (spinner) spinner.style.display = 'inline-flex';

      // Mengambil data nama untuk personalisasi respon
      const senderName = nameInput.value.trim();

      // Simulasi proses pengiriman data ke server (Asynchronous Delay ~ 1.5 detik)
      setTimeout(() => {
        // Kembalikan tombol ke keadaan semula
        submitBtn.disabled = false;
        if (btnText) btnText.style.display = 'inline-flex';
        if (spinner) spinner.style.display = 'none';

        // 1. Tampilkan notifikasi pop-up Toast yang menarik
        showToast(
          'Pesan Berhasil Terkirim!',
          `Halo ${senderName}, terima kasih telah menghubungi. Saya akan segera membalas email Anda.`
        );

        // 2. Tampilkan pesan sukses di bawah form
        if (formAlert) {
          formAlert.className = 'form-alert success';
          formAlert.innerHTML = `<i class="fa-solid fa-circle-check"></i> <strong>Sukses!</strong> Pesan Anda berhasil dikirimkan. Terima kasih, <strong>${senderName}</strong>!`;
          formAlert.style.display = 'block';
        }

        // 3. Kosongkan seluruh isian formulir (Form Reset)
        contactForm.reset();

        // 4. Hapus alert box setelah 8 detik
        setTimeout(() => {
          if (formAlert) {
            formAlert.style.display = 'none';
          }
        }, 8000);

      }, 1500);
    });
  }


  /* --------------------------------------------------------------------------
     8. TOMBOL "LIHAT DETAIL" PROYEK
     -------------------------------------------------------------------------- */
  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectName = btn.getAttribute('data-project');
      if (projectName && subjectInput) {
        // Isi subjek pesan otomatis dengan nama proyek yang diklik
        subjectInput.value = `Tanya Detail Proyek: ${projectName}`;
        clearError(subjectInput);
      }
    });
  });

});

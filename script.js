document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Ambil Nama Tamu dari Parameter URL (Contoh: index.html?to=Bapak+Ahmad)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get('to');
    const guestNameElement = document.getElementById('guest-name');
    
    if (guestParam) {
        guestNameElement.textContent = guestParam;
    }

    // 2. Fungsi Buka Undangan
    const openBtn = document.getElementById('open-invitation');
    const cover = document.getElementById('cover');
    const mainContent = document.getElementById('main-content');

    openBtn.addEventListener('click', () => {
        cover.classList.add('slide-up');
        mainContent.classList.remove('hidden');
        
        // Trigger animasi elemen yang terlihat pertama kali
        setTimeout(checkScroll, 300);
    });

    // 3. Hitung Mundur (Countdown) ke 14 Maret 2027, 08:00:00 WIB
    const targetDate = new Date("March 14, 2027 08:00:00").getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timer);
            document.getElementById("countdown").innerHTML = "<h3>Acara Telah Berlangsung</h3>";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, '0');
        document.getElementById("hours").textContent = String(hours).padStart(2, '0');
        document.getElementById("minutes").textContent = String(minutes).padStart(2, '0');
        document.getElementById("seconds").textContent = String(seconds).padStart(2, '0');
    }, 1000);

    // 4. Animasi Fade-In Saat Halaman Di-scroll
    const fadeElements = document.querySelectorAll('.fade-in');

    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        fadeElements.forEach(el => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add('visible');
            }
        });
    }

    window.addEventListener('scroll', checkScroll);

    // 5. Fitur Kirim Ucapan & Doa (Buku Tamu)
    const wishForm = document.getElementById('wish-form');
    const wishList = document.getElementById('wish-list');

    wishForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('sender-name').value.trim();
        const attendance = document.getElementById('attendance').value;
        const message = document.getElementById('wish-message').value.trim();

        if (name && attendance && message) {
            const newWish = document.createElement('div');
            newWish.classList.add('wish-item');
            newWish.innerHTML = `
                <div class="wish-header">
                    <strong>${escapeHTML(name)}</strong>
                    <span class="badge">${escapeHTML(attendance)}</span>
                </div>
                <p>${escapeHTML(message)}</p>
            `;

            // Tambahkan ucapan baru di urutan paling atas
            wishList.prepend(newWish);

            // Reset form
            wishForm.reset();
        }
    });

    // Mencegah XSS sederhana pada input ucapan
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag]));
    }
});
          

document.addEventListener("DOMContentLoaded", () => {
    // 1. Nama tamu dari URL (?to=Nama+Tamu)
    const urlParams = new URLSearchParams(window.location.search);
    const guestParam = urlParams.get("to");
    const guestNameElement = document.getElementById("guest-name");

    if (guestParam && guestNameElement) {
        guestNameElement.textContent = guestParam;
    }

    // 2. Buka undangan
    const openBtn = document.getElementById("open-invitation");
    const cover = document.getElementById("cover");
    const mainContent = document.getElementById("main-content");

    if (openBtn && cover && mainContent) {
        openBtn.addEventListener("click", () => {
            cover.classList.add("slide-up");
            mainContent.classList.remove("hidden");
            setTimeout(checkScroll, 300);
        });
    }

    // 3. Hitung mundur ke 14 Maret 2027 pukul 08.00 WIB
    const targetDate = new Date("2027-03-14T08:00:00+07:00").getTime();

    const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        if (distance < 0) {
            clearInterval(timer);
            const countdownEl = document.getElementById("countdown");
            if (countdownEl) {
                countdownEl.innerHTML = "<h3>Acara Sedang / Telah Berlangsung</h3>";
            }
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("days").textContent = String(days).padStart(2, "0");
        document.getElementById("hours").textContent = String(hours).padStart(2, "0");
        document.getElementById("minutes").textContent = String(minutes).padStart(2, "0");
        document.getElementById("seconds").textContent = String(seconds).padStart(2, "0");
    }, 1000);

    // 4. Animasi scroll
    const fadeElements = document.querySelectorAll(".fade-in");

    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.85;
        fadeElements.forEach((el) => {
            const boxTop = el.getBoundingClientRect().top;
            if (boxTop < triggerBottom) {
                el.classList.add("visible");
            }
        });
    }

    window.addEventListener("scroll", checkScroll);

    // 5. Salin nomor rekening
    const copyBtn = document.getElementById("copy-norek");
    const norekText = document.getElementById("norek-text");

    if (copyBtn && norekText) {
        copyBtn.addEventListener("click", async () => {
            const nomor = norekText.textContent.trim();
            try {
                await navigator.clipboard.writeText(nomor);
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Tersalin';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="far fa-copy"></i> Salin';
                }, 2000);
            } catch {
                alert("Nomor rekening: " + nomor);
            }
        });
    }

    // 6. Ucapan & doa
    const wishForm = document.getElementById("wish-form");
    const wishList = document.getElementById("wish-list");

    if (wishForm && wishList) {
        wishForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const name = document.getElementById("sender-name").value.trim();
            const attendance = document.getElementById("attendance").value;
            const message = document.getElementById("wish-message").value.trim();

            if (name && attendance && message) {
                const newWish = document.createElement("div");
                newWish.classList.add("wish-item");
                newWish.innerHTML = `
                    <div class="wish-header">
                        <strong>${escapeHTML(name)}</strong>
                        <span class="badge">${escapeHTML(attendance)}</span>
                    </div>
                    <p>${escapeHTML(message)}</p>
                `;

                wishList.prepend(newWish);
                wishForm.reset();
            }
        });
    }

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, (tag) => ({
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            "'": "&#39;",
            '"': "&quot;"
        }[tag]));
    }
});
        

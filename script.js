document.addEventListener("DOMContentLoaded", () => {
  const cover = document.getElementById("cover");
  const openBtn = document.getElementById("open-btn");
  const mainContent = document.getElementById("main-content");
  const bottomNav = document.getElementById("bottom-nav");
  const musicBtn = document.getElementById("music-toggle");
  const musicDisc = document.getElementById("music-disc");
  const bgMusic = document.getElementById("bg-music");
  const toastEl = document.getElementById("toast");

  let isPlaying = false;
  let audioCtx = null;
  let nasheedInterval = null;

  const params = new URLSearchParams(window.location.search);
  const guestParam = params.get("to");
  if (guestParam && guestParam.trim() !== "") {
    document.getElementById("guest-name").textContent = guestParam.trim();
    document.getElementById("sender-name").value = guestParam.trim();
  }

  function showToast(message) {
    toastEl.textContent = message;
    toastEl.classList.add("show");
    setTimeout(() => toastEl.classList.remove("show"), 2800);
  }

  function startFallbackNasheed() {
    if (nasheedInterval) return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    if (!audioCtx) audioCtx = new AudioContextClass();
    if (audioCtx.state === "suspended") audioCtx.resume();

    const melody = [293.66, 349.23, 440.0, 466.16, 440.0, 392.0, 349.23, 329.63];
    let step = 0;

    const playNote = () => {
      if (!isPlaying) return;
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(melody[step % melody.length], now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(0.06, now + 0.18);
      gain.gain.exponentialRampToValueAtTime(0.0008, now + 1.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 1.2);
      step++;
    };

    playNote();
    nasheedInterval = setInterval(playNote, 1250);
  }

  function stopFallbackNasheed() {
    if (nasheedInterval) {
      clearInterval(nasheedInterval);
      nasheedInterval = null;
    }
  }

  function playMusic() {
    isPlaying = true;
    musicDisc.classList.add("playing");
    bgMusic.play().catch(() => {
      startFallbackNasheed();
    });
  }

  function pauseMusic() {
    isPlaying = false;
    musicDisc.classList.remove("playing");
    bgMusic.pause();
    stopFallbackNasheed();
  }

  musicBtn.addEventListener("click", () => {
    if (isPlaying) {
      pauseMusic();
      showToast("Wedding Nasheed dijeda");
    } else {
      playMusic();
      showToast("Memutar Wedding Nasheed");
    }
  });

  openBtn.addEventListener("click", () => {
    cover.classList.add("opened");
    mainContent.classList.remove("locked");
    bottomNav.classList.remove("hidden");
    musicBtn.classList.remove("hidden");
    playMusic();
  });

  const targetDate = new Date("2027-03-14T08:00:00+07:00").getTime();

  function updateCountdown() {
    const now = Date.now();
    const diff = targetDate - now;

    if (diff <= 0) {
      document.getElementById("days").textContent = "00";
      document.getElementById("hours").textContent = "00";
      document.getElementById("minutes").textContent = "00";
      document.getElementById("seconds").textContent = "00";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const m = Math.floor((diff / (1000 * 60)) % 60);
    const s = Math.floor((diff / 1000) % 60);

    document.getElementById("days").textContent = String(d).padStart(2, "0");
    document.getElementById("hours").textContent = String(h).padStart(2, "0");
    document.getElementById("minutes").textContent = String(m).padStart(2, "0");
    document.getElementById("seconds").textContent = String(s).padStart(2, "0");
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  document.getElementById("copy-address-btn").addEventListener("click", () => {
    const addr = document.getElementById("address-text").textContent.trim();
    navigator.clipboard.writeText(addr).then(() => {
      showToast("Alamat berhasil disalin");
    });
  });

  document.getElementById("copy-rek-btn").addEventListener("click", () => {
    const rek = document.getElementById("account-number").textContent.trim();
    navigator.clipboard.writeText(rek).then(() => {
      showToast("Nomor rekening 801001010401534 disalin");
    });
  });

  const sections = document.querySelectorAll("main .section");
  const navItems = document.querySelectorAll(".bottom-nav .nav-item");

  window.addEventListener("scroll", () => {
    let currentId = "beranda";
    sections.forEach((sec) => {
      const top = sec.offsetTop - 160;
      if (window.scrollY >= top) {
        currentId = sec.getAttribute("id");
      }
    });

    navItems.forEach((item) => {
      item.classList.toggle("active", item.dataset.target === currentId);
    });
  });

  const rsvpForm = document.getElementById("rsvp-form");
  const wishesList = document.getElementById("wishes-list");
  const STORAGE_KEY = "wishes_husnul_khoir";

  function renderWishes() {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    wishesList.innerHTML = saved
      .map(
        (item) => `
        <div class="wish-item">
          <div class="wish-header">
            <strong>${item.name}</strong>
            <span class="wish-badge">${item.status}</span>
          </div>
          <p>${item.message}</p>
        </div>`
      )
      .join("");
  }

  renderWishes();

  rsvpForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("sender-name").value.trim();
    const status = document.getElementById("attendance").value;
    const message = document.getElementById("wish-message").value.trim();

    if (!name || !message) return;

    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    saved.unshift({ name, status, message });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
    renderWishes();

    const waText = `Assalamu'alaikum Wr. Wb.%0A%0ASaya *${encodeURIComponent(name)}* (${encodeURIComponent(status)}) mengucapkan selamat menempuh hidup baru untuk *Husnul Khotimah & Muhammad Khoir*.%0A%0ADoa & Ucapan:%0A"${encodeURIComponent(message)}"`;
    window.open(`https://wa.me/6285171630292?text=${waText}`, "_blank");
    rsvpForm.reset();
    showToast("Ucapan tersimpan & membuka WhatsApp");
  });
});

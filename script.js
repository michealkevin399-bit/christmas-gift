const canvas = document.createElement("canvas");
canvas.className = "snow";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d");
let w, h;
let flakes = [];

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

function createFlakes() {
  flakes = Array.from({ length: 120 }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 3 + 1,
    speed: Math.random() * 1 + 0.5
  }));
}
createFlakes();

function draw() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  flakes.forEach(f => {
    ctx.beginPath();
    ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
    ctx.fill();
    f.y += f.speed;
    f.x += Math.sin(f.y * 0.01);
    if (f.y > h) {
      f.y = -5;
      f.x = Math.random() * w;
    }
  });
  requestAnimationFrame(draw);
}
draw();

// --- Persistent Music Logic ---
const bgm = new Audio();
bgm.src = 'assets/bgm.mp3'; // Must match your folder
bgm.loop = true;
bgm.volume = 0.35;

let musicPlaying = localStorage.getItem('bgmPlaying') === '1';

function updateButton() {
  const btn = document.getElementById('music-toggle');
  if (btn) btn.textContent = bgm.paused ? '🔈 Music OFF' : '🔊 Music ON';
}

// Sync music time across pages
const savedTime = localStorage.getItem('bgmTime');
if (savedTime) bgm.currentTime = parseFloat(savedTime);

setInterval(() => {
  if (!bgm.paused) localStorage.setItem('bgmTime', bgm.currentTime);
}, 1000);

function playMusic() {
  bgm.play().then(() => {
    localStorage.setItem('bgmPlaying', '1');
    updateButton();
  }).catch(() => {
    console.log("Waiting for user interaction...");
  });
}

function toggleMusic() {
  if (bgm.paused) {
    playMusic();
  } else {
    bgm.pause();
    localStorage.setItem('bgmPlaying', '0');
    updateButton();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateButton();
  const btn = document.getElementById('music-toggle');
  if (btn) btn.addEventListener('click', toggleMusic);

  // Auto-play attempt on first click anywhere (like "Open Notes")
  window.addEventListener('click', () => {
    if (localStorage.getItem('bgmPlaying') !== '0') {
        playMusic();
    }
  }, { once: true });
});

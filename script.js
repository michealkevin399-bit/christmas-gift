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

// Background music controls
const bgm = new Audio();
bgm.src = 'assets/bgm.mp3'; // ENSURE THIS FOLDER AND FILE EXIST ON GITHUB
bgm.loop = true;
bgm.volume = 0.40; 
bgm.preload = 'auto';
let musicPlaying = false;

function updateMusicButton() {
  const btn = document.getElementById('music-toggle');
  if (!btn) return;
  btn.textContent = musicPlaying ? '🔊 Music ON' : '🔈 Music OFF';
}

function playMusic() {
  if (!musicPlaying) {
    bgm.play().then(() => {
      musicPlaying = true;
      updateMusicButton();
      localStorage.setItem('bgmPlaying', '1');
    }).catch(e => console.log("Playback waiting for interaction."));
  }
}

function toggleMusic() {
  if (musicPlaying) {
    bgm.pause();
    musicPlaying = false;
  } else {
    playMusic();
  }
  updateMusicButton();
}

document.addEventListener('DOMContentLoaded', () => {
  updateMusicButton();
  
  // 1. Manual Toggle
  const btn = document.getElementById('music-toggle');
  if (btn) btn.addEventListener('click', toggleMusic);

  // 2. Start music when she clicks ANY link or button on the page
  const interactionEvents = ['click', 'touchstart'];
  const startOnInteraction = () => {
    playMusic();
    interactionEvents.forEach(event => window.removeEventListener(event, startOnInteraction));
  };

  interactionEvents.forEach(event => window.addEventListener(event, startOnInteraction));
});

const back = document.getElementById("layerBack"),
      mid  = document.getElementById("layerMid"),
      front= document.getElementById("layerFront"),
      text = document.getElementById("textBox");

const src = "images/1.jpg";
[back, mid, front].forEach(e => e.style.backgroundImage = `url('${src}')`);

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;
let liteMode = false;

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || innerWidth < 700;

// Auto LITE Mode if low FPS
let frames = 0, start = performance.now();
function checkFPS() {
  frames++;
  const now = performance.now();
  if (now - start >= 1000) {
    const fps = (frames * 1000) / (now - start);
    if (fps < 30 && !liteMode) {
      liteMode = true;
      document.body.classList.add("lite");
      mid.style.display = "none";
      front.style.opacity = 0.2;
      back.style.filter = "brightness(0.9) blur(3px)";
      console.warn("Modo LITE activado automáticamente.");
    }
    frames = 0;
    start = now;
  }
  requestAnimationFrame(checkFPS);
}
requestAnimationFrame(checkFPS);

// Movimiento interactivo
function onMove(x, y) {
  targetX = (x / innerWidth - 0.5) * 2;
  targetY = (y / innerHeight - 0.5) * 2;
}
addEventListener("mousemove", e => onMove(e.clientX, e.clientY), { passive: true });
addEventListener("touchmove", e => {
  if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

// Animación fluida con distorsión tipo “ondas”
function animate() {
  mouseX += (targetX - mouseX) * 0.06;
  mouseY += (targetY - mouseY) * 0.06;

  const dx = mouseX * 20;
  const dy = mouseY * 20;
  const wave = Math.sin(Date.now() * 0.0015) * 10;
  const wave2 = Math.cos(Date.now() * 0.0012) * 15;

  back.style.transform = `translate3d(${dx * 0.4 + wave}px, ${dy * 0.4 + wave2}px, 0) scale(1.05)`;
  mid.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.06)`;
  front.style.transform = `translate3d(${dx * 1.6}px, ${dy * 1.6}px, 0) scale(1.07)`;
  back.style.filter = `brightness(0.9) contrast(1.3) blur(${6 + Math.sin(Date.now() * 0.001) * 1.5}px)`;

  requestAnimationFrame(animate);
}
animate();

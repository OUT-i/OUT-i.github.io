// === Configuración básica ===
const back = document.getElementById("layerBack");
const mid = document.getElementById("layerMid");
const front = document.getElementById("layerFront");
const text = document.getElementById("textBox");

const src = "images/1.jpg";
[back, mid, front].forEach(el => el.style.backgroundImage = `url('${src}')`);

let isLite = false;
const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || window.innerWidth < 700;

// === Modo LITE: se activa por bajo rendimiento ===
let frameCount = 0, start = performance.now();
function testFPS(){
  frameCount++;
  const now = performance.now();
  if(now - start >= 1000){
    const fps = (frameCount * 1000) / (now - start);
    if(fps < 30) activateLiteMode();
    return;
  }
  requestAnimationFrame(testFPS);
}
requestAnimationFrame(testFPS);

function activateLiteMode(){
  if(isLite) return;
  isLite = true;
  document.body.classList.add("lite");
  [mid, front].forEach(l => l.style.display = "none");
  back.style.filter = "brightness(0.9) blur(3px)";
  console.warn("Modo LITE activado automáticamente.");
}

// === Movimiento fluido parallax ===
let lastX = 0, lastY = 0;
function moveLayers(x, y){
  const w = window.innerWidth, h = window.innerHeight;
  const nx = (x / w - 0.5) * 2;
  const ny = (y / h - 0.5) * 2;

  // Interpolación suave
  lastX += (nx - lastX) * 0.1;
  lastY += (ny - lastY) * 0.1;

  const strength = isLite ? 6 : 18;
  back.style.transform = `translate3d(${lastX * strength * 0.4}px, ${lastY * strength * 0.4}px, 0) scale(1.05)`;
  mid.style.transform  = `translate3d(${lastX * strength}px, ${lastY * strength}px, 0) scale(1.06)`;
  front.style.transform= `translate3d(${lastX * strength * 1.6}px, ${lastY * strength * 1.6}px, 0) scale(1.07)`;

  text.style.transform = `translate3d(${nx * 4}px, ${ny * 4}px, 0)`;
  requestAnimationFrame(()=>moveLayers(x,y));
}

// === Eventos ===
window.addEventListener("mousemove", e => moveLayers(e.clientX, e.clientY), {passive:true});
window.addEventListener("touchmove", e => {
  if(e.touches[0]) moveLayers(e.touches[0].clientX, e.touches[0].clientY);
}, {passive:true});

// === Animación idle (suave cuando no hay movimiento) ===
function idleMotion(){
  const t = Date.now() * 0.0001;
  const dx = Math.sin(t) * 8;
  const dy = Math.cos(t) * 6;
  back.style.transform = `translate3d(${dx}px,${dy}px,0) scale(1.04)`;
  if(!isLite){
    mid.style.transform = `translate3d(${dx*1.5}px,${dy*1.5}px,0) scale(1.05)`;
    front.style.transform = `translate3d(${dx*2}px,${dy*2}px,0) scale(1.06)`;
  }
  requestAnimationFrame(idleMotion);
}
idleMotion();

const back = document.getElementById("layerBack"),
      mid  = document.getElementById("layerMid"),
      front= document.getElementById("layerFront");

const src = "images/1.jpg";
[back, mid, front].forEach(e => e.style.backgroundImage = `url('${src}')`);

let mouseX = 0, mouseY = 0;
let targetX = 0, targetY = 0;

function onMove(x, y) {
  targetX = (x / innerWidth - 0.5) * 2;
  targetY = (y / innerHeight - 0.5) * 2;
}

addEventListener("mousemove", e => onMove(e.clientX, e.clientY), { passive: true });
addEventListener("touchmove", e => {
  if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY);
}, { passive: true });

function animate() {
  mouseX += (targetX - mouseX) * 0.08;
  mouseY += (targetY - mouseY) * 0.08;

  const dx = mouseX * 25;
  const dy = mouseY * 25;

  const wave1 = Math.sin(Date.now() * 0.0012) * 15;
  const wave2 = Math.cos(Date.now() * 0.0014) * 12;

  back.style.transform = `translate3d(${dx * 0.3 + wave1}px, ${dy * 0.3 + wave2}px, 0) scale(1.05)`;
  mid.style.transform = `translate3d(${dx * 0.6 - wave2}px, ${dy * 0.6 - wave1}px, 0) scale(1.06)`;
  front.style.transform = `translate3d(${dx * 1.2}px, ${dy * 1.2}px, 0) scale(1.07)`;

  back.style.filter = `brightness(0.9) contrast(1.3) blur(${6 + Math.sin(Date.now() * 0.001) * 1.2}px)`;

  requestAnimationFrame(animate);
}
animate();

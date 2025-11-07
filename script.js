const bg=document.getElementById('bg'),
      g1=document.getElementById('g1'),
      g2=document.getElementById('g2'),
      green=document.getElementById('green'),
      copy=document.getElementById('copy'),
      turb=document.getElementById('turb'),
      disp=document.getElementById('disp'),
      slices=[...document.querySelectorAll('.slice')];

const src='images/1.jpg';
[bg,g1,g2,green].forEach(el=>el.style.backgroundImage=`url('${src}')`);

const isMobile=/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)||window.innerWidth<700;
let isLite=false;

let frameCount=0,start=performance.now();
function fpsTest(){
  frameCount++;
  const now=performance.now();
  if(now-start>=800){
    const fps=(frameCount*1000)/(now-start);
    if(fps<30) activateLiteMode(`FPS bajo (${fps.toFixed(1)})`);
    return;
  }
  requestAnimationFrame(fpsTest);
}
requestAnimationFrame(fpsTest);

let maxShift=isMobile?18:40,
    maxDispScale=isMobile?60:120,
    moveThrottle=isMobile?90:45;

let lastMove=Date.now(),greenTimeout=null,lastUpdate=0;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

function activateLiteMode(reason="rendimiento"){
  if(isLite) return;
  isLite=true;
  document.body.classList.add("lite-mode");
  console.warn("⚡ Activando modo LITE por "+reason);
  [bg,g1,g2,green].forEach(el=>{
    el.style.filter="contrast(120%) brightness(120%) grayscale(80%)";
    el.style.imageRendering="auto";
  });
  maxShift=14;maxDispScale=0;moveThrottle=120;
  slices.forEach(s=>s.remove());
  disp?.setAttribute('scale','0');
  turb?.remove();
  green.style.opacity=0.3;
}

function handleMove(x,y){
  const now=performance.now();
  if(now-lastUpdate<moveThrottle) return;
  lastUpdate=now;
  const w=window.innerWidth,h=window.innerHeight;
  const nx=(x/w)*2-1,ny=(y/h)*2-1;
  const intensity=Math.sqrt(nx*nx+ny*ny);
  const shiftX=Math.round(nx*maxShift*(0.8+intensity));
  const shiftY=Math.round(ny*maxShift*(0.8+intensity));

  bg.style.transform=`translate3d(${shiftX/3}px,${shiftY/3}px,0) scale(1.02)`;
  g1.style.transform=`translate3d(${shiftX*0.9}px,${-shiftY*0.4}px,0) rotate(${nx*2}deg)`;
  g2.style.transform=`translate3d(${-shiftX*0.6}px,${shiftY*0.7}px,0) rotate(${ny*3}deg)`;

  if(!isLite&&disp){
    const scale=Math.round(clamp((intensity*maxDispScale)+(Math.random()*20-10),8,maxDispScale));
    disp.setAttribute('scale',String(scale));
    if(!isMobile&&turb){
      const bf=clamp(0.6+intensity*1.2+(Math.random()*0.2-0.1),0.3,1.6);
      turb.setAttribute('baseFrequency',String(bf));
    }
  }

  copy.style.transform=`translate3d(${nx*4}px,${ny*4}px,0)`;
  if(intensity>0.35) triggerGreenFlash(intensity);
  lastMove=Date.now();
}

function triggerGreenFlash(intensity){
  if(greenTimeout) clearTimeout(greenTimeout);
  const op=isLite?0.4:0.9*clamp(intensity,0.3,1);
  green.style.opacity=op;
  green.style.transform=`translate3d(${(Math.random()*2-1)*10}px,${(Math.random()*2-1)*10}px,0) scale(${1.02+Math.random()*0.04})`;
  greenTimeout=setTimeout(()=>green.style.opacity=0,isLite?200:120);
}

function idleJitter(){
  const now=Date.now();
  if(now-lastMove>900){
    const j=isLite?1:2;
    bg.style.transform=`translate3d(${(Math.random()*2-1)*j}px,${(Math.random()*2-1)*j}px,0) scale(1.01)`;
    g1.style.transform=`translate3d(${(Math.random()*2-1)*j*2}px,${(Math.random()*2-1)*j*2}px,0)`;
    g2.style.transform=`translate3d(${(Math.random()*2-1)*j*2}px,${(Math.random()*2-1)*j*2}px,0)`;
    if(!isLite&&disp) disp.setAttribute('scale',String(8+Math.random()*10));
  }
  requestAnimationFrame(idleJitter);
}
requestAnimationFrame(idleJitter);

window.addEventListener('mousemove',e=>handleMove(e.clientX,e.clientY),{passive:true});
window.addEventListener('touchmove',e=>{if(e.touches[0])handleMove(e.touches[0].clientX,e.touches[0].clientY);},{passive:true});

document.addEventListener('visibilitychange',()=>{
  if(document.hidden){
    disp?.setAttribute('scale','6');
    bg.style.transform=g1.style.transform=g2.style.transform='translate3d(0,0,0) scale(1)';
  }
});

const imgTest=new Image();
imgTest.src=src;
imgTest.onerror=()=>{
  console.warn('⚠️ No se encuentra images/1.jpg');
  [bg,g1,g2,green].forEach(el=>el.style.backgroundColor='#111');
};

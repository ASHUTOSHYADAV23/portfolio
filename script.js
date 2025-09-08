/* ========= Year ========= */
document.getElementById('year').textContent = new Date().getFullYear();

/* ========= Typing Effect ========= */
const roles = [
  "AI Enthusiast",
  "Web Developer",
  "Creative Coder",
  "3D UI Explorer"
];
const typingEl = document.getElementById("typing");
let rIndex = 0, cIndex = 0, deleting = false;

function typeLoop(){
  const current = roles[rIndex];
  if(!deleting){
    typingEl.textContent = current.slice(0, ++cIndex);
    if(cIndex === current.length){ deleting = true; setTimeout(typeLoop, 900); return; }
  }else{
    typingEl.textContent = current.slice(0, --cIndex);
    if(cIndex === 0){ deleting = false; rIndex = (rIndex + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 60 : 95);
}
typeLoop();

/* ========= Scroll Reveal (IntersectionObserver) ========= */
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    }
  });
},{ threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el=> io.observe(el));

/* ========= Canvas Particle Network (AI look) ========= */
const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d', { alpha: true });

let W, H, DPR;
function resize(){
  DPR = Math.min(window.devicePixelRatio || 1, 2);
  W = canvas.width = Math.floor(innerWidth * DPR);
  H = canvas.height = Math.floor(innerHeight * DPR);
  canvas.style.width = innerWidth + 'px';
  canvas.style.height = innerHeight + 'px';
}
resize(); addEventListener('resize', resize);

const PARTICLES = [];
const COUNT_BASE = 90; // adjust density
function spawnParticles(){
  PARTICLES.length = 0;
  const count = Math.floor((innerWidth * innerHeight) / 14000) + COUNT_BASE;
  for(let i=0;i<count;i++){
    PARTICLES.push({
      x: Math.random()*W,
      y: Math.random()*H,
      vx: (Math.random()-.5)*0.25*DPR,
      vy: (Math.random()-.5)*0.25*DPR,
      r: (Math.random()*1.6 + 0.6) * DPR
    });
  }
}
spawnParticles(); addEventListener('resize', spawnParticles);

function step(){
  ctx.clearRect(0,0,W,H);
  // draw links
  for(let i=0;i<PARTICLES.length;i++){
    const a = PARTICLES[i];
    a.x += a.vx; a.y += a.vy;
    if(a.x<0||a.x>W) a.vx*=-1;
    if(a.y<0||a.y>H) a.vy*=-1;
    // dots
    ctx.beginPath();
    ctx.fillStyle = "rgba(0,231,255,.85)";
    ctx.shadowBlur = 8; ctx.shadowColor = "rgba(0,231,255,.6)";
    ctx.arc(a.x,a.y,a.r,0,Math.PI*2); ctx.fill();
    // links to nearby
    for(let j=i+1;j<PARTICLES.length;j++){
      const b = PARTICLES[j];
      const dx = a.x-b.x, dy = a.y-b.y;
      const d2 = dx*dx + dy*dy;
      const max = 120*DPR, max2 = max*max;
      if(d2 < max2){
        const alpha = 1 - (d2/max2);
        ctx.beginPath();
        ctx.moveTo(a.x,a.y);
        ctx.lineTo(b.x,b.y);
        ctx.strokeStyle = `rgba(138,43,226,${0.25*alpha})`;
        ctx.lineWidth = 0.9*alpha;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(step);
}
step();

/* ========= 3D Tilt (subtle) for cards ========= */
function addTilt(el, strength=10){
  let rect;
  function set(e){
    rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - .5) * -strength;
    const ry = ((x / rect.width)  - .5) *  strength;
    el.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(0)`;
    el.style.boxShadow = `0 18px 40px rgba(0,231,255,.18)`;
  }
  function reset(){
    el.style.transform = '';
    el.style.boxShadow = '';
  }
  el.addEventListener('mousemove', set);
  el.addEventListener('mouseleave', reset);
}
document.querySelectorAll('.tilt3d, .card-3d').forEach(el=> addTilt(el, 10));
document.querySelectorAll('.tilt').forEach(el=> addTilt(el, 6));

/* ========= Reduce Motion Respect ========= */
if(window.matchMedia('(prefers-reduced-motion: reduce)').matches){
  // slow down / reduce effects if needed
  PARTICLES.forEach(p=>{ p.vx*=0.3; p.vy*=0.3; });
}

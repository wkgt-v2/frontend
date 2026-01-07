<template>
  <section
    id="hero"
    class="wkgt-hero relative w-full min-h-dvh flex items-center justify-center text-center"
  >
    <canvas ref="canvasRef" class="wkgt-canvas" aria-hidden="true"></canvas>
    <Radial class="absolute -top-1/3 -left-1/4 size-[960px] -z-10" />
    <Radial class="absolute -top-1/5 -right-1/5 size-[960px] -z-10" />
    <div class="absolute inset-0 border-b border-primary overflow-hidden -z-10">
      <Radial
        class="absolute bottom-0 left-1/2 translate-y-[55%] -translate-x-1/2 size-[960px] -z-10"
      />
    </div>
    <div class="hero-content px-6">
      <h1
        class="main-heading"
        v-html="parseI18n($t('landing.hero.title'))"
      ></h1>

      <div class="tagline">
        {{ $t("landing.hero.tagline", "INVENTING THE TOMORROW") }}
      </div>

      <p class="hero-desc">
        {{ $t("landing.hero.subtitle") }}
      </p>

      <a href="#services" class="btn-cyber inline-block">
        {{ $t("landing.hero.cta", "Explore Solutions") }}
      </a>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

const canvasRef = ref<HTMLCanvasElement | null>(null);

let ctx: CanvasRenderingContext2D | null = null;
let rafId = 0;

let particlesArray: Particle[] = [];
const numberOfParticles = 80;

const mouse = {
  x: null as number | null,
  y: null as number | null,
  radius: 150,
};

class Particle {
  x: number;
  y: number;
  directionX: number;
  directionY: number;
  size: number;

  constructor(
    x: number,
    y: number,
    directionX: number,
    directionY: number,
    size: number
  ) {
    this.x = x;
    this.y = y;
    this.directionX = directionX;
    this.directionY = directionY;
    this.size = size;
  }

  draw() {
    if (!ctx) return;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    ctx.fillStyle = "#00f7ff";
    ctx.fill();
  }

  update(width: number, height: number) {
    if (this.x > width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > height || this.y < 0) this.directionY = -this.directionY;

    if (mouse.x !== null && mouse.y !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius + this.size) {
        if (mouse.x < this.x && this.x < width - this.size * 10) this.x += 2;
        if (mouse.x > this.x && this.x > this.size * 10) this.x -= 2;
        if (mouse.y < this.y && this.y < height - this.size * 10) this.y += 2;
        if (mouse.y > this.y && this.y > this.size * 10) this.y -= 2;
      }
    }

    this.x += this.directionX;
    this.y += this.directionY;
    this.draw();
  }
}

function resizeCanvas() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const dpr = Math.max(window.devicePixelRatio || 1, 1);
  const rect = canvas.parentElement?.getBoundingClientRect();

  const cssW = rect?.width ?? window.innerWidth;
  const cssH = rect?.height ?? window.innerHeight;

  canvas.style.width = `${cssW}px`;
  canvas.style.height = `${cssH}px`;

  canvas.width = Math.floor(cssW * dpr);
  canvas.height = Math.floor(cssH * dpr);

  ctx = canvas.getContext("2d");
  if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  init();
}

function init() {
  const canvas = canvasRef.value;
  if (!canvas) return;

  const rect = canvas.parentElement?.getBoundingClientRect();
  const width = rect?.width ?? window.innerWidth;
  const height = rect?.height ?? window.innerHeight;

  particlesArray = [];
  for (let i = 0; i < numberOfParticles; i++) {
    const size = Math.random() * 2 + 1;
    const x = Math.random() * (width - size * 4) + size * 2;
    const y = Math.random() * (height - size * 4) + size * 2;
    const directionX = Math.random() * 0.4 - 0.2;
    const directionY = Math.random() * 0.4 - 0.2;
    particlesArray.push(new Particle(x, y, directionX, directionY, size));
  }
}

function connect(width: number, height: number) {
  if (!ctx) return;

  for (let a = 0; a < particlesArray.length; a++) {
    for (let b = a; b < particlesArray.length; b++) {
      const dx = particlesArray[a].x - particlesArray[b].x;
      const dy = particlesArray[a].y - particlesArray[b].y;
      const distance = dx * dx + dy * dy;

      if (distance < (width / 7) * (height / 7)) {
        const opacityValue = 1 - distance / 15000;
        ctx.strokeStyle = `rgba(0, 247, 255, ${opacityValue})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
        ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  const canvas = canvasRef.value;
  if (!canvas || !ctx) return;

  const rect = canvas.parentElement?.getBoundingClientRect();
  const width = rect?.width ?? window.innerWidth;
  const height = rect?.height ?? window.innerHeight;

  rafId = requestAnimationFrame(animate);
  ctx.clearRect(0, 0, width, height);

  for (let i = 0; i < particlesArray.length; i++) {
    particlesArray[i].update(width, height);
  }
  connect(width, height);
}

function onMouseMove(e: MouseEvent) {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
}

onMounted(() => {
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("mousemove", onMouseMove);
  animate();
});

onUnmounted(() => {
  window.removeEventListener("resize", resizeCanvas);
  window.removeEventListener("mousemove", onMouseMove);
  cancelAnimationFrame(rafId);
});
</script>

<style scoped>
:global(:root) {
  --bg-main: #050505;
  --accent-blue: #00f7ff;
}

.wkgt-hero {
  background: radial-gradient(
    circle at center,
    rgba(0, 0, 0, 0) 0%,
    rgba(5, 5, 5, 1) 100%
  );
  overflow: hidden;
}

.wkgt-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: -20;
  pointer-events: none;
}

.hero-content {
  z-index: 2;
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.main-heading {
  font-family: "Orbitron", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.tagline {
  font-family: "Orbitron", sans-serif;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: clamp(1.2rem, 2.2vw, 1.8rem);
  color: var(--accent-blue);
  margin-bottom: 40px;
  text-shadow: 0 0 15px rgba(0, 247, 255, 0.8);
}

.hero-desc {
  max-width: 600px;
  margin: 0 auto 40px auto;
  color: #ccc;
  line-height: 1.6;
}

.btn-cyber {
  padding: 15px 40px;
  border: 2px solid var(--accent-blue);
  color: var(--accent-blue);
  font-family: "Orbitron", sans-serif;
  font-weight: 700;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  cursor: pointer;
  background: transparent;
}

.btn-cyber:hover {
  background: var(--accent-blue);
  color: var(--bg-main);
  box-shadow: 0 0 30px rgba(0, 247, 255, 0.6);
}
</style>

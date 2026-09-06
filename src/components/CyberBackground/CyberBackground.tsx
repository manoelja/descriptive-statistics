import { useRef, useEffect, useCallback } from 'react';
import './CyberBackground.css';

/* ────────── helpers ────────── */
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const rand = (min: number, max: number) => Math.random() * (max - min) + min;

/* ────────── constants ────────── */
const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;

const SYMBOLS = ['μ', 'σ', 'Σ', 'π', '%', 'x̄', 'n', 'χ²', 'p', 'r', 'β', 'α', 'θ', 'λ'];

interface Node {
  x: number; y: number;
  vx: number; vy: number;
  r: number;
  hue: number;        // HSL hue for color variation
  phase: number;      // sinusoidal phase offset
  pulseSpeed: number;
}

interface Particle {
  x: number; y: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
}

interface Symbol {
  x: number; y: number;
  text: string;
  alpha: number;
  targetAlpha: number;
  size: number;
}

interface MicroBar {
  x: number; y: number;
  bars: number[];
  alpha: number;
  targetAlpha: number;
  width: number;
  height: number;
  life: number;
}

/* ────────── component ────────── */
export default function CyberBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({ x: 0, y: 0, active: false });
  const dataRef = useRef<{
    nodes: Node[];
    particles: Particle[];
    symbols: Symbol[];
    microBars: MicroBar[];
    lastFrame: number;
    paused: boolean;
  } | null>(null);

  const prefersReduced = useRef(false);    const spawnNode = useCallback((_w: number, _h: number): Node => ({
      x: rand(0, _w), y: rand(0, _h),
      vx: rand(-0.4, 0.4), vy: rand(-0.4, 0.4),
      r: rand(2, 5),
      hue: rand(120, 170),
      phase: rand(0, Math.PI * 2),
      pulseSpeed: rand(0.01, 0.03),
    }), []);

  const spawnParticle = useCallback((w: number): Particle => ({
    x: rand(0, w), y: rand(-20, 0),
    vy: rand(0.3, 1.0),
    size: rand(1, 2.5),
    alpha: rand(0.1, 0.3),
    life: rand(0, 1),
  }), []);

  const spawnSymbol = useCallback((w: number, h: number): Symbol => ({
    x: rand(40, w - 40), y: rand(40, h - 40),
    text: SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)],
    alpha: 0,
    targetAlpha: rand(0.04, 0.1),
    size: rand(12, 22),
  }), []);

  const spawnMicroBar = useCallback((w: number, h: number): MicroBar => {
    const count = Math.floor(rand(4, 8));
    const bars: number[] = [];
    for (let i = 0; i < count; i++) bars.push(rand(0.2, 1));
    return {
      x: rand(30, w - 100), y: rand(30, h - 80),
      bars, alpha: 0, targetAlpha: rand(0.06, 0.12),
      width: count * 6 + (count - 1) * 3, height: rand(30, 50),
      life: rand(3, 6),
    };
  }, []);

  /* ──── init & loop ──── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    prefersReduced.current = mq.matches;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = window.innerWidth + 'px';
      canvas.style.height = window.innerHeight + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    /* ── mouse tracking ── */
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };
    const onMouseLeave = () => { mouseRef.current.active = false; };
    window.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const w = () => window.innerWidth;
    const h = () => window.innerHeight;

    const isMobile = w() < 768;
    const NODE_COUNT = isMobile ? 15 : 28;
    const PARTICLE_MAX = isMobile ? 40 : 80;

    const nodes: Node[] = [];
    for (let i = 0; i < NODE_COUNT; i++) nodes.push(spawnNode(w(), h()));

    const data = {
      nodes,
      particles: [] as Particle[],
      symbols: [] as Symbol[],
      microBars: [] as MicroBar[],
      lastFrame: 0,
      paused: false,
    };
    dataRef.current = data;

    /* ── visibility ── */
    const onVis = () => { data.paused = document.hidden; };
    document.addEventListener('visibilitychange', onVis);

    let raf: number;
    let time = 0;

    const update = (dt: number) => {
      const W = w();
      const H = h();
      time += dt * 0.001;
      const mouse = mouseRef.current;

      // Nodes — brownian drift + boundary bounce + mouse interaction
      for (const n of nodes) {
        n.vx += (Math.sin(time * 0.5 + n.phase) * 0.01 + rand(-0.005, 0.005));
        n.vy += (Math.cos(time * 0.3 + n.phase) * 0.01 + rand(-0.005, 0.005));

        // Mouse interaction — attract nearby nodes
        if (mouse.active) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 10) {
            const force = (200 - dist) / 200 * 0.08;
            n.vx += (dx / dist) * force;
            n.vy += (dy / dist) * force;
          }
        }

        // Clamp velocity
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        const maxSpeed = prefersReduced.current ? 0.1 : 0.8;
        if (speed > maxSpeed) { n.vx *= maxSpeed / speed; n.vy *= maxSpeed / speed; }
        n.x += n.vx;
        n.y += n.vy;
        // Bounce at edges
        if (n.x < -20) { n.x = -20; n.vx = Math.abs(n.vx); }
        if (n.x > W + 20) { n.x = W + 20; n.vx = -Math.abs(n.vx); }
        if (n.y < -20) { n.y = -20; n.vy = Math.abs(n.vy); }
        if (n.y > H + 20) { n.y = H + 20; n.vy = -Math.abs(n.vy); }
      }

      // Particles — fall + fade
      for (let i = data.particles.length - 1; i >= 0; i--) {
        const p = data.particles[i];
        p.y += p.vy;
        p.life += dt * 0.0005;
        p.alpha *= 0.998;
        if (p.y > H + 10 || p.alpha < 0.01 || p.life > 1) {
          data.particles.splice(i, 1);
        }
      }
      // Spawn new particles
      if (data.particles.length < PARTICLE_MAX && Math.random() < 0.15) {
        data.particles.push(spawnParticle(W));
      }

      // Symbols — fade in/out cycle
      for (let i = data.symbols.length - 1; i >= 0; i--) {
        const s = data.symbols[i];
        s.alpha = lerp(s.alpha, s.targetAlpha, 0.02);
        if (Math.random() < 0.002) {
          s.targetAlpha = s.targetAlpha > 0 ? 0 : rand(0.04, 0.1);
        }
        if (s.alpha < 0.001 && s.targetAlpha === 0) {
          data.symbols.splice(i, 1);
        }
      }
      if (data.symbols.length < 8 && Math.random() < 0.01) {
        data.symbols.push(spawnSymbol(W, H));
      }

      // Micro-bars — appear, stay, disappear
      for (let i = data.microBars.length - 1; i >= 0; i--) {
        const m = data.microBars[i];
        m.life -= dt * 0.001;
        m.alpha = m.life > 1 ? lerp(m.alpha, m.targetAlpha, 0.03) : lerp(m.alpha, 0, 0.03);
        if (m.life <= 0 && m.alpha < 0.01) {
          data.microBars.splice(i, 1);
        }
      }
      if (data.microBars.length < 3 && Math.random() < 0.005) {
        data.microBars.push(spawnMicroBar(W, H));
      }
    };

    const draw = () => {
      const W = w();
      const H = h();
      ctx.clearRect(0, 0, W, H);
      const mouse = mouseRef.current;

      const isLight = document.documentElement.classList.contains('light-theme');
      const nodeColor = isLight ? '21,128,61' : '74,222,128';
      const lineColor = isLight ? '21,128,61' : '74,222,128';
      const symbolColor = isLight ? '5,46,22' : '180,200,180';
      const microBarColor = isLight ? '21,128,61' : '74,222,128';
      const particleColor = isLight ? '13,148,136' : '45,212,191';

      const lineAlphaMultiplier = 1.3;
      const lineWidth = isLight ? 1.2 : 1;

      // Draw mouse glow
      if (mouse.active) {
        const glowGrad = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 150);
        glowGrad.addColorStop(0, `rgba(22, 163, 74, 0.15)`);
        glowGrad.addColorStop(0.5, `rgba(45, 212, 191, 0.05)`);
        glowGrad.addColorStop(1, `rgba(22, 163, 74, 0)`);
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 150, 0, Math.PI * 2);
        ctx.fill();

        // Mouse cursor ring
        ctx.strokeStyle = `rgba(22, 163, 74, 0.3)`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw connections between nearby nodes
      const CONNECT_DIST = 150;
      ctx.lineWidth = lineWidth;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DIST) {
            const alpha = (1 - dist / CONNECT_DIST) * 0.15 * lineAlphaMultiplier;
            ctx.strokeStyle = `rgba(${lineColor},${alpha})`;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw connections from mouse to nearby nodes
      if (mouse.active) {
        ctx.lineWidth = isLight ? 1.5 : 1.2;
        for (const n of nodes) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const alpha = (1 - dist / 180) * 0.4 * lineAlphaMultiplier;
            const grad = ctx.createLinearGradient(mouse.x, mouse.y, n.x, n.y);
            grad.addColorStop(0, `rgba(22, 163, 74, ${alpha})`);
            grad.addColorStop(1, `rgba(45, 212, 191, ${alpha * 0.5})`);
            ctx.strokeStyle = grad;
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(n.x, n.y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const pulse = Math.sin(time * 2 + n.phase) * 0.3 + 0.7;
        const radius = n.r * pulse;
        // Glow
        const grad = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, radius * 4);
        grad.addColorStop(0, `hsla(${n.hue},70%,60%,${isLight ? 0.25 : 0.2})`);
        grad.addColorStop(1, `hsla(${n.hue},70%,60%,0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius * 4, 0, Math.PI * 2);
        ctx.fill();
        // Core
        ctx.fillStyle = `rgba(${nodeColor},${isLight ? 0.8 : 0.7})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw particles
      for (const p of data.particles) {
        ctx.fillStyle = `rgba(${particleColor},${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw symbols
      ctx.font = '14px monospace';
      for (const s of data.symbols) {
        ctx.fillStyle = `rgba(${symbolColor},${s.alpha})`;
        ctx.font = `${s.size}px monospace`;
        ctx.fillText(s.text, s.x, s.y);
      }

      // Draw micro-bars
      for (const m of data.microBars) {
        const barW = 5;
        const gap = 3;
        for (let i = 0; i < m.bars.length; i++) {
          const barH = m.bars[i] * m.height;
          const x = m.x + i * (barW + gap);
          const y = m.y + m.height - barH;
          ctx.fillStyle = `rgba(${microBarColor},${m.alpha * 0.7})`;
          ctx.fillRect(x, y, barW, barH);
          // Tiny dot on top
          ctx.fillStyle = `rgba(${microBarColor},${m.alpha})`;
          ctx.beginPath();
          ctx.arc(x + barW / 2, y - 3, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    const loop = (ts: number) => {
      raf = requestAnimationFrame(loop);
      if (data.paused || prefersReduced.current) return;
      if (ts - data.lastFrame < FRAME_MS) return;
      data.lastFrame = ts;
      update(FRAME_MS);
      draw();
    };

    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [spawnNode, spawnParticle, spawnSymbol, spawnMicroBar]);

  return <canvas ref={canvasRef} className="cyber-background" />;
}

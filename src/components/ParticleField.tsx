import React, { useEffect, useRef } from 'react';

/**
 * Antigravity hero field: a grid of Google-colored dots flowing along overlapping
 * sine waves (pseudo flow-field), with cursor gravity — particles are repelled from
 * the pointer and spring back to their wave orbit. Canvas 2D, rAF, 60fps-targeted.
 */
const COLORS = ['#4285F4', '#EA4335', '#FBBC04', '#34A853'];

export const ParticleField: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w = 0, h = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    const mouse = { x: -9999, y: -9999 };
    const R = 130;            // cursor influence radius
    const R2 = R * R;

    type P = { ox: number; oy: number; x: number; y: number; vx: number; vy: number;
               size: number; color: string; a: number; ph: number };
    let parts: P[] = [];

    const isDark = () => document.documentElement.dataset.theme === 'dark';

    const build = () => {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr); canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const gap = w < 640 ? 34 : 28;          // spacing → hundreds/low-thousands of dots
      parts = [];
      for (let gy = 0; gy < h + gap; gy += gap) {
        for (let gx = 0; gx < w + gap; gx += gap) {
          const jx = (Math.random() - 0.5) * gap * 0.6;
          const jy = (Math.random() - 0.5) * gap * 0.6;
          parts.push({
            ox: gx + jx, oy: gy + jy, x: gx + jx, y: gy + jy, vx: 0, vy: 0,
            size: 1 + Math.random() * 2.5,
            color: COLORS[(Math.random() * COLORS.length) | 0],
            a: 0.3 + Math.random() * 0.5,
            ph: Math.random() * Math.PI * 2,
          });
        }
      }
    };

    let t = 0;
    const step = () => {
      t += 0.012;
      ctx.clearRect(0, 0, w, h);
      const baseA = isDark() ? 0.9 : 0.75;
      const amp = 12;
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        // overlapping sine "flow field" target around the home position
        const tx = p.ox + Math.sin(t + p.oy * 0.012 + p.ph) * amp + Math.cos(t * 0.6 + p.ox * 0.008) * amp * 0.5;
        const ty = p.oy + Math.cos(t * 0.85 + p.ox * 0.011 + p.ph) * amp + Math.sin(t * 0.5 + p.oy * 0.009) * amp * 0.5;
        // spring toward the wave target
        p.vx += (tx - p.x) * 0.045;
        p.vy += (ty - p.y) * 0.045;
        // cursor gravity (repulsion within radius, eased)
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d2 = dx * dx + dy * dy;
        if (d2 < R2 && d2 > 0.01) {
          const d = Math.sqrt(d2);
          const f = (1 - d / R);
          const push = f * f * 6;
          p.vx += (dx / d) * push;
          p.vy += (dy / d) * push;
        }
        p.vx *= 0.86; p.vy *= 0.86;      // friction / damping
        p.x += p.vx; p.y += p.vy;
        ctx.globalAlpha = p.a * baseA;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(step);
    };

    let raf = 0;
    const onMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999; };
    const onResize = () => { dpr = Math.min(window.devicePixelRatio || 1, 2); build(); };

    build();
    if (reduced) {
      // static single frame
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) { ctx.globalAlpha = p.a * 0.6; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2); ctx.fill(); }
    } else {
      if (window.matchMedia('(pointer: fine)').matches) window.addEventListener('mousemove', onMove, { passive: true });
      window.addEventListener('mouseout', onLeave);
      raf = requestAnimationFrame(step);
    }
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 w-full h-full" />;
};

import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  alpha: number;
  color: string;
}

export const ParticleOverlay: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let pw = (canvas.width = window.innerWidth);
    let ph = (canvas.height = window.innerHeight);
    const particles: Particle[] = [];
    let animId: number;

    const handleResize = () => {
      pw = canvas.width = window.innerWidth;
      ph = canvas.height = window.innerHeight;
    };

    const handleClick = (e: MouseEvent) => {
      const colors = ['#2563eb', '#10b981', '#ef4444'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          r: Math.random() * 2 + 1,
          alpha: 1,
          color,
        });
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    document.addEventListener('click', handleClick);

    const updateParticles = () => {
      ctx.clearRect(0, 0, pw, ph);
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 0.03;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.globalAlpha = p.alpha;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-[70] h-screen w-screen"
    />
  );
};

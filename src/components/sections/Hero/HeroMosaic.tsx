import React, { useRef, useEffect } from 'react';

const hexToRgb = (hex: string): [number, number, number] => [
  parseInt(hex.slice(1, 3), 16),
  parseInt(hex.slice(3, 5), 16),
  parseInt(hex.slice(5, 7), 16)
];

const COLOR_STOPS: [number, [number, number, number]][] = [
  [0, hexToRgb('#f8fafc')],
  [0.3, hexToRgb('#eff6ff')],
  [0.52, hexToRgb('#dbeafe')],
  [0.72, hexToRgb('#93c5fd')],
  [0.88, hexToRgb('#3b82f6')],
  [1, hexToRgb('#2563eb')]
];

const LIME_ACCENT = hexToRgb('#10b981');

const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const lerpColor = (
  c1: [number, number, number],
  c2: [number, number, number],
  factor: number
): [number, number, number] => [
  c1[0] + (c2[0] - c1[0]) * factor,
  c1[1] + (c2[1] - c1[1]) * factor,
  c1[2] + (c2[2] - c1[2]) * factor
];

const gaussian = (dx: number, dy: number, sigma: number) =>
  Math.exp(-(dx * dx + dy * dy) / (sigma * sigma));

const getStopColor = (val: number): [number, number, number] => {
  for (let s = 1; s < COLOR_STOPS.length; s++) {
    const [stopVal, color] = COLOR_STOPS[s];
    if (val <= stopVal) {
      const [prevVal, prevColor] = COLOR_STOPS[s - 1];
      return lerpColor(prevColor, color, (val - prevVal) / (stopVal - prevVal));
    }
  }
  return COLOR_STOPS[COLOR_STOPS.length - 1][1];
};

export const HeroMosaic: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !parent || !ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let tileSize = 64;
    let gap = 3;
    let cols = 0;
    let rows = 0;
    let offsetX = 0;
    let ripples = new Float32Array(0);
    let rafId = 0;
    let lastTime = 0;
    let isVisible = true;
    const startTime = performance.now();
    const pointer = { x: -1e4, y: -1e4, active: false };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = parent.clientWidth;
      height = Math.min(parent.clientHeight, 1600);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      tileSize = width < 640 ? 40 : width < 1024 ? 52 : 64;
      gap = width < 640 ? 2 : 3;
      cols = Math.ceil(width / tileSize) + 1;
      rows = Math.ceil(height / tileSize) + 1;
      offsetX = -((cols * tileSize - width) / 2);
      ripples = new Float32Array(cols * rows);
    };

    const draw = (now: number) => {
      const t = reducedMotion ? 0 : (now - startTime) / 1000;
      const effectiveH = Math.min(height, 1000);
      ctx.clearRect(0, 0, width, height);
      const cornerRadius = 0.16 * tileSize;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const posX = offsetX + c * tileSize;
          const posY = r * tileSize;
          const normX = (posX + tileSize / 2) / width;
          const normY = (posY + tileSize / 2) / effectiveH;

          // Pseudorandom static hash
          const noise =
            (43758.5453 * Math.sin(127.1 * c + 311.7 * r)) % 1 -
            Math.floor((43758.5453 * Math.sin(127.1 * c + 311.7 * r)) % 1);

          let w = 0.3 * normX + 0.78 * normY - 0.12;
          w +=
            0.32 *
              gaussian(
                normX - (0.86 + 0.06 * Math.sin(0.13 * t)),
                normY - (0.42 + 0.12 * Math.cos(0.1 * t)),
                0.32
              ) +
            0.22 *
              gaussian(
                normX - (0.08 + 0.05 * Math.cos(0.09 * t)),
                normY - 0.95,
                0.3
              ) +
            0.05 * Math.sin(7 * normX + 0.35 * t) * Math.cos(5 * normY - 0.28 * t) +
            (noise - 0.5) * 0.07;

          if (!reducedMotion) {
            w += 0.14 * Math.pow(Math.max(0, Math.sin(0.7 * t + 60 * noise)), 24);
          }

          const cellIdx = r * cols + c;
          if (pointer.active) {
            const dist = Math.hypot(
              posX + tileSize / 2 - pointer.x,
              posY + tileSize / 2 - pointer.y
            );
            if (dist < 2.2 * tileSize) {
              ripples[cellIdx] = Math.max(
                ripples[cellIdx],
                1 - dist / (2.2 * tileSize)
              );
            }
          }

          w += 0.32 * ripples[cellIdx];
          ripples[cellIdx] *= 0.9;

          const limeStrength = clamp(
            0.8 *
              gaussian(
                normX - (0.97 + 0.03 * Math.sin(0.17 * t)),
                normY - (0.82 + 0.06 * Math.sin(0.12 * t)),
                0.2
              )
          );

          let color = getStopColor(clamp(w * (1 - 0.55 * limeStrength)));
          if (limeStrength > 0.02) {
            color = lerpColor(color, LIME_ACCENT, limeStrength * clamp(1.3 * w));
          }

          const drawX = posX + gap / 2;
          const drawY = posY + gap / 2;
          const size = tileSize - gap;

          ctx.beginPath();
          if (typeof ctx.roundRect === 'function') {
            ctx.roundRect(drawX, drawY, size, size, cornerRadius);
          } else {
            ctx.rect(drawX, drawY, size, size);
          }
          ctx.fillStyle = `rgb(${color[0] | 0} ${color[1] | 0} ${color[2] | 0})`;
          ctx.fill();

          const grad = ctx.createLinearGradient(drawX, drawY, drawX + size, drawY + size);
          grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
          grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    };

    const loop = (now: number) => {
      rafId = 0;
      if (isVisible && !document.hidden) {
        if (now - lastTime > 40) {
          lastTime = now;
          draw(now);
        }
        rafId = requestAnimationFrame(loop);
      }
    };

    const trigger = () => {
      if (reducedMotion) {
        draw(performance.now());
        return;
      }
      if (!rafId) {
        rafId = requestAnimationFrame(loop);
      }
    };

    resize();
    draw(performance.now());
    trigger();

    const resizeObserver = new ResizeObserver(() => {
      resize();
      draw(performance.now());
    });
    resizeObserver.observe(parent);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
      if (isVisible) trigger();
    });
    intersectionObserver.observe(canvas);

    const onVisibilityChange = () => {
      if (!document.hidden) trigger();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    const onPointerMove = (e: PointerEvent) => {
      if (reducedMotion || e.pointerType !== 'mouse') return;
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    parent.addEventListener('pointermove', onPointerMove);
    parent.addEventListener('pointerleave', onPointerLeave);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      parent.removeEventListener('pointermove', onPointerMove);
      parent.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 top-0 w-full [mask-image:linear-gradient(to_bottom,black_55%,transparent_96%)] ${className}`}
    />
  );
};


import React, { useRef, useEffect } from 'react';

interface WarpGridCanvasProps {
  className?: string;
  tone?: 'brand' | 'monochrome';
  fade?: boolean;
}

const THEMES = {
  brand: {
    line: { r: 255, g: 255, b: 255, a: 0.09 },
    lineActive: { r: 14, g: 165, b: 233, a: 0.9 },
    node: { r: 255, g: 255, b: 255, a: 0.16 },
    nodeActive: { r: 56, g: 189, b: 248, a: 1 },
    glow: '14, 165, 233',
    ripple: '125, 211, 252'
  },
  monochrome: {
    line: { r: 255, g: 255, b: 255, a: 0.1 },
    lineActive: { r: 255, g: 255, b: 255, a: 0.9 },
    node: { r: 255, g: 255, b: 255, a: 0.18 },
    nodeActive: { r: 255, g: 255, b: 255, a: 1 },
    glow: '255, 255, 255',
    ripple: '255, 255, 255'
  }
};

const lerp = (start: number, end: number, t: number) => start + (end - start) * t;

const colorString = (
  c1: { r: number; g: number; b: number; a: number },
  c2: { r: number; g: number; b: number; a: number },
  ratio: number
) => {
  const r = Math.round(lerp(c1.r, c2.r, ratio));
  const g = Math.round(lerp(c1.g, c2.g, ratio));
  const b = Math.round(lerp(c1.b, c2.b, ratio));
  const a = lerp(c1.a, c2.a, ratio).toFixed(3);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const smoothstep = (x: number) => x * x * (3 - 2 * x);

export const VisionGridCanvas: React.FC<WarpGridCanvasProps> = ({
  className = '',
  tone = 'brand',
  fade = true
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const section = container?.parentElement;
    if (!container || !canvas || !section) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const theme = THEMES[tone];
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let offscreenCanvas: HTMLCanvasElement | null = null;

    let cursorPos = { x: -9999, y: -9999 };
    let targetPos = { x: -9999, y: -9999 };
    let hoverIntensity = 0;
    let targetHover = 0;
    let ripples: { x: number; y: number; radius: number; opacity: number; born: number }[] = [];
    let animId = 0;
    let isIntersecting = false;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = container.clientWidth;
      height = Math.min(window.innerHeight, container.clientHeight);

      canvas.style.height = `${height}px`;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);

      // Background subtle dot matrix (every 28px)
      offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvas.width;
      offscreenCanvas.height = canvas.height;
      const offCtx = offscreenCanvas.getContext('2d');
      if (offCtx) {
        offCtx.scale(dpr, dpr);
        offCtx.fillStyle = 'rgba(255, 255, 255, 0.05)';
        for (let x = 14; x < width; x += 28) {
          for (let y = 14; y < height; y += 28) {
            offCtx.beginPath();
            offCtx.arc(x, y, 0.7, 0, 2 * Math.PI);
            offCtx.fill();
          }
        }
      }

      draw(performance.now());
    };

    // Calculate displacement of a grid vertex at (origX, origY)
    const computeVertex = (
      origX: number,
      origY: number,
      colIndex: number,
      rowIndex: number,
      colsCount: number,
      rowsCount: number
    ) => {
      const edgeFactorX = Math.min(colIndex / 1.5, (colsCount - 1 - colIndex) / 1.5, 1);
      const edgeFactorY = Math.min(rowIndex / 1.5, (rowsCount - 1 - rowIndex) / 1.5, 1);
      const boundaryDampening = edgeFactorX * edgeFactorX * edgeFactorY * edgeFactorY;

      const dx = origX - cursorPos.x;
      const dy = origY - cursorPos.y;
      const dist = Math.hypot(dx, dy);
      const pressure = Math.max(0, 1 - dist / 260) * boundaryDampening * hoverIntensity;

      let rippleOffsetX = 0;
      let rippleOffsetY = 0;

      for (const rip of ripples) {
        const rdx = origX - rip.x;
        const rdy = origY - rip.y;
        const rdist = Math.hypot(rdx, rdy) - rip.radius;
        if (Math.abs(rdist) < 55) {
          const ripFactor = (1 - Math.abs(rdist) / 55) * rip.opacity * 18 * boundaryDampening;
          const ripAngle = Math.atan2(rdy, rdx);
          const dir = rdist < 0 ? -1 : 1;
          rippleOffsetX -= Math.cos(ripAngle) * ripFactor * dir;
          rippleOffsetY -= Math.sin(ripAngle) * ripFactor * dir;
        }
      }

      if (dist < 260 && dist > 0 && boundaryDampening > 0 && hoverIntensity > 0) {
        const normDist = dist / 260;
        const pushMag =
          (1 - normDist) *
          (1 - normDist) *
          Math.min(1, dist / 60) *
          24 *
          boundaryDampening *
          hoverIntensity;
        const angle = Math.atan2(dy, dx);
        return {
          x: origX - Math.cos(angle) * pushMag + rippleOffsetX,
          y: origY - Math.sin(angle) * pushMag + rippleOffsetY,
          p: pressure
        };
      }

      return {
        x: origX + rippleOffsetX,
        y: origY + rippleOffsetY,
        p: pressure
      };
    };

    const draw = (now: number) => {
      if (!ctx || !width || !height) return;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (offscreenCanvas) {
        ctx.drawImage(offscreenCanvas, 0, 0, width, height);
      }

      // Update ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const rip = ripples[i];
        const elapsed = (now - rip.born) / 1000;
        rip.radius = Math.max(0, 400 * elapsed);
        rip.opacity = Math.max(0, 1 - 1.2 * elapsed);
        if (rip.opacity <= 0) {
          ripples.splice(i, 1);
        }
      }

      // Grid squares size: 56px
      const cols = Math.max(2, Math.ceil(width / 56)) + 1;
      const rows = Math.max(2, Math.ceil(height / 56)) + 1;
      const stepX = width / (cols - 1);
      const stepY = height / (rows - 1);

      const grid: { x: number; y: number; p: number }[][] = [];
      for (let r = 0; r < rows; r++) {
        grid[r] = [];
        for (let c = 0; c < cols; c++) {
          grid[r][c] = computeVertex(c * stepX, r * stepY, c, r, cols, rows);
        }
      }

      // Draw lines
      ctx.lineCap = 'butt';
      ctx.beginPath();

      const activeLines: [{ x: number; y: number; p: number }, { x: number; y: number; p: number }][] = [];
      const addSegment = (p1: { x: number; y: number; p: number }, p2: { x: number; y: number; p: number }) => {
        if (p1.p + p2.p > 0.01) {
          activeLines.push([p1, p2]);
        } else {
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
      };

      // Horizontal lines
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 1; c++) {
          addSegment(grid[r][c], grid[r][c + 1]);
        }
      }
      // Vertical lines
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows - 1; r++) {
          addSegment(grid[r][c], grid[r + 1][c]);
        }
      }

      // Base inactive lines
      ctx.strokeStyle = colorString(theme.line, theme.line, 0);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      // Active illuminated lines
      for (const [p1, p2] of activeLines) {
        const factor = smoothstep((p1.p + p2.p) / 2);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.strokeStyle = colorString(theme.line, theme.lineActive, factor);
        ctx.lineWidth = lerp(0.8, 1.5, factor);
        ctx.stroke();
      }

      // Draw intersection nodes (dots)
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const pt = grid[r][c];
          const factor = smoothstep(pt.p);
          const radius = lerp(1.6, 3.2, factor);

          // Glowing halo on active node
          if (factor > 0.3) {
            const glowRadius = radius + lerp(0, 6, (factor - 0.3) / 0.7);
            const grad = ctx.createRadialGradient(pt.x, pt.y, 0.5 * radius, pt.x, pt.y, glowRadius);
            grad.addColorStop(0, `rgba(${theme.glow}, ${(0.3 * factor).toFixed(3)})`);
            grad.addColorStop(1, `rgba(${theme.glow}, 0)`);
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, glowRadius, 0, 2 * Math.PI);
            ctx.fillStyle = grad;
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, radius, 0, 2 * Math.PI);
          ctx.fillStyle = colorString(theme.node, theme.nodeActive, factor);
          ctx.fill();
        }
      }

      // Draw ripple shockwaves
      for (const rip of ripples) {
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(0, rip.radius), 0, 2 * Math.PI);
        ctx.strokeStyle = `rgba(${theme.ripple}, ${(0.28 * rip.opacity).toFixed(3)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    };

    const animate = (now: number) => {
      cursorPos.x = lerp(cursorPos.x, targetPos.x, 0.1);
      cursorPos.y = lerp(cursorPos.y, targetPos.y, 0.1);
      hoverIntensity = lerp(hoverIntensity, targetHover, 0.08);

      draw(now);

      const stillMoving =
        ripples.length > 0 ||
        Math.abs(hoverIntensity - targetHover) >= 0.005 ||
        Math.abs(cursorPos.x - targetPos.x) >= 0.3 ||
        Math.abs(cursorPos.y - targetPos.y) >= 0.3;

      if (isIntersecting && stillMoving) {
        animId = requestAnimationFrame(animate);
      } else {
        animId = 0;
      }
    };

    const requestTick = () => {
      if (!animId && isIntersecting && !prefersReducedMotion) {
        animId = requestAnimationFrame(animate);
      }
    };

    const getLocalPos = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    };

    const onPointerMove = (e: PointerEvent) => {
      const pos = getLocalPos(e);
      if (hoverIntensity < 0.01) {
        cursorPos.x = pos.x;
        cursorPos.y = pos.y;
      }
      targetPos.x = pos.x;
      targetPos.y = pos.y;
      targetHover = e.pointerType === 'mouse' ? 1 : 0.8;
      requestTick();
    };

    const onPointerLeave = () => {
      targetHover = 0;
      requestTick();
    };

    const onPointerDown = (e: PointerEvent) => {
      const pos = getLocalPos(e);
      ripples.push({
        x: pos.x,
        y: pos.y,
        radius: 0,
        opacity: 1,
        born: performance.now()
      });
      requestTick();
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    window.addEventListener('resize', resize);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isIntersecting = entry.isIntersecting;
      if (isIntersecting) {
        draw(performance.now());
      } else if (animId) {
        cancelAnimationFrame(animId);
        animId = 0;
      }
    });
    intersectionObserver.observe(container);

    if (!prefersReducedMotion) {
      section.addEventListener('pointermove', onPointerMove as any);
      section.addEventListener('pointerleave', onPointerLeave as any);
      section.addEventListener('pointerdown', onPointerDown as any);
    }

    resize();

    return () => {
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      window.removeEventListener('resize', resize);
      section.removeEventListener('pointermove', onPointerMove as any);
      section.removeEventListener('pointerleave', onPointerLeave as any);
      section.removeEventListener('pointerdown', onPointerDown as any);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [tone]);

  return (
    <div
      ref={containerRef}
      aria-hidden={true}
      className={`pointer-events-none absolute inset-0 z-0 overflow-clip ${className}`}
    >
      <canvas
        ref={canvasRef}
        className="sticky top-0 block w-full"
        style={
          fade
            ? {
                maskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent, #000 12%, #000 88%, transparent)'
              }
            : undefined
        }
      />
    </div>
  );
};

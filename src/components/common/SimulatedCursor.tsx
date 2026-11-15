import React, { useState, useLayoutEffect, RefObject } from 'react';

const CURSOR_BITMAP = [
  'o.........',
  'oo........',
  'ofo.......',
  'offo......',
  'offfo.....',
  'offffo....',
  'offfffo...',
  'offffffo..',
  'offfffffo.',
  'offfffoooo',
  'offofo....',
  'ofo.ofo...',
  'oo..ofo...',
  'o....ofo..',
  '.....ofo..',
  '......o...'
];

const CURSOR_PIXELS = CURSOR_BITMAP.flatMap((row, y) =>
  row.split('').map((char, x) => ({ x, y, char })).filter((p) => p.char !== '.')
);

export const CursorSvg: React.FC<{
  fill?: string;
  outline?: string;
  scale?: number;
  className?: string;
}> = ({ fill = '#0c0d11', outline = '#ffffff', scale = 2.4, className = '' }) => (
  <svg
    width={CURSOR_BITMAP[0].length * scale}
    height={CURSOR_BITMAP.length * scale}
    viewBox={`0 0 ${CURSOR_BITMAP[0].length} ${CURSOR_BITMAP.length}`}
    shapeRendering="crispEdges"
    className={className}
    aria-hidden="true"
  >
    {CURSOR_PIXELS.map(({ x, y, char }) => (
      <rect
        key={`${x}-${y}`}
        x={x}
        y={y}
        width="1"
        height="1"
        fill={char === 'o' ? outline : fill}
      />
    ))}
  </svg>
);

export interface SimulatedCursorProps {
  container: RefObject<HTMLElement>;
  target: string | null;
  clickId: number | string | null;
  visible: boolean;
  width: number;
  height: number;
  label?: string;
  durationMs?: number;
}

export const SimulatedCursor: React.FC<SimulatedCursorProps> = ({
  container,
  target,
  clickId,
  visible,
  width,
  height,
  label = 'TestPilot',
  durationMs = 700
}) => {
  const [pos, setPos] = useState({ x: 0.5 * width, y: 0.55 * height });

  useLayoutEffect(() => {
    const parent = container.current;
    if (!parent || !target) return;

    let anim2: number;
    const anim = requestAnimationFrame(() => {
      const el = parent.querySelector(`[data-target="${target}"]`);
      if (!el) {
        // If element not found yet on first frame, retry on next frame
        anim2 = requestAnimationFrame(() => {
          const retryEl = parent.querySelector(`[data-target="${target}"]`);
          if (!retryEl) return;
          const r = retryEl.getBoundingClientRect();
          const pRect = parent.getBoundingClientRect();
          if (!pRect.width) return;
          const scale = pRect.width / parent.offsetWidth;
          setPos({
            x: (r.left - pRect.left + 0.55 * r.width) / scale,
            y: (r.top - pRect.top + 0.62 * r.height) / scale
          });
        });
        return;
      }
      const r = el.getBoundingClientRect();
      const pRect = parent.getBoundingClientRect();
      if (!pRect.width) return;
      const scale = pRect.width / parent.offsetWidth;
      setPos({
        x: (r.left - pRect.left + 0.55 * r.width) / scale,
        y: (r.top - pRect.top + 0.62 * r.height) / scale
      });
    });

    return () => {
      cancelAnimationFrame(anim);
      if (anim2) cancelAnimationFrame(anim2);
    };
  }, [container, target]);

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute left-0 top-0 z-20 transition-[transform,opacity] ease-[var(--ease-in-out-quart)] ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: `translate(${pos.x}px, ${pos.y}px)`,
        transitionDuration: `${durationMs}ms`
      }}
    >
      {clickId !== null && (
        <span
          key={clickId}
          className="absolute -left-4 -top-4 size-8 rounded-full border-2 border-sky"
          style={{ animation: 'ping-ring 600ms var(--ease-out-expo) both' }}
        />
      )}
      <CursorSvg fill="#0c0d11" scale={2.4} className="drop-shadow-[0_2px_3px_rgb(20_20_26/0.25)]" />
      <span className="absolute left-5 top-8 rounded-[3px] bg-sky px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wide text-white">
        {label}
      </span>
    </div>
  );
};


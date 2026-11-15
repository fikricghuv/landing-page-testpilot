import React, { useRef, useState, useLayoutEffect, ReactNode, RefObject } from 'react';

export interface ScaledViewportProps {
  width: number;
  height: number;
  children: ReactNode;
  className?: string;
  innerRef?: RefObject<HTMLDivElement>;
}

export const ScaledViewport: React.FC<ScaledViewportProps> = ({
  width,
  height,
  children,
  className = '',
  innerRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const updateScale = () => {
      setScale(el.clientWidth / width);
    };

    updateScale();
    const observer = new ResizeObserver(updateScale);
    observer.observe(el);

    return () => observer.disconnect();
  }, [width]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden ${className}`}
      style={{ aspectRatio: `${width} / ${height}` }}
    >
      <div
        ref={innerRef}
        className="absolute left-0 top-0 origin-top-left transition-opacity duration-300"
        style={{
          width,
          height,
          transform: `scale(${scale || 1})`,
          opacity: scale ? 1 : 0
        }}
      >
        {children}
      </div>
    </div>
  );
};


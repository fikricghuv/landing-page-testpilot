import React, { useEffect, useRef, useState } from 'react';

interface Bug {
  x: number;
  y: number;
  type: string;
  color: string;
  hp: number;
  maxHp: number;
  points: number;
  r: number;
  speed: number;
  blink: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  color: string;
}

export const Arcade: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'over'>('idle');
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45);
  const [lives, setLives] = useState(3);
  const [muted, setMuted] = useState(true);

  // Mutable refs for animation loop
  const stateRef = useRef({
    gameState: 'idle' as 'idle' | 'playing' | 'over',
    score: 0,
    lives: 3,
    timeLeft: 45,
    bugs: [] as Bug[],
    particles: [] as Particle[],
    spawnTimer: 0,
  });

  // Sync stateRef with state
  useEffect(() => {
    stateRef.current.gameState = gameState;
  }, [gameState]);

  useEffect(() => {
    stateRef.current.score = score;
  }, [score]);

  useEffect(() => {
    stateRef.current.lives = lives;
  }, [lives]);

  const startGame = () => {
    stateRef.current.score = 0;
    stateRef.current.lives = 3;
    stateRef.current.timeLeft = 45;
    stateRef.current.bugs = [];
    stateRef.current.particles = [];
    stateRef.current.spawnTimer = 0;
    stateRef.current.gameState = 'playing';

    setScore(0);
    setLives(3);
    setTimeLeft(45);
    setGameState('playing');
  };

  // Timer effect
  useEffect(() => {
    if (gameState !== 'playing') return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameState('over');
          stateRef.current.gameState = 'over';
          setBestScore((b) => Math.max(b, stateRef.current.score));
          return 0;
        }
        stateRef.current.timeLeft = prev - 1;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState]);

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 800;
    let H = 450;

    const resize = () => {
      W = canvas.clientWidth || 800;
      H = canvas.clientHeight || 450;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const spawnBug = () => {
      const types = [
        { type: 'normal', color: '#e92e4a', hp: 1, points: 10, r: 14, speed: 1.6 },
        { type: 'flaky', color: '#f3ce3a', hp: 1, points: 25, r: 12, speed: 2.3 },
        { type: 'regression', color: '#ff7022', hp: 2, points: 40, r: 18, speed: 1.2 },
      ];
      const t = types[Math.floor(Math.random() * types.length)];
      stateRef.current.bugs.push({
        x: W + 20,
        y: 40 + Math.random() * (H - 80),
        type: t.type,
        color: t.color,
        hp: t.hp,
        maxHp: t.hp,
        points: t.points,
        r: t.r,
        speed: t.speed,
        blink: Math.random() * Math.PI,
      });
    };

    const addExplosion = (x: number, y: number, color: string) => {
      for (let i = 0; i < 10; i++) {
        stateRef.current.particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 6,
          vy: (Math.random() - 0.5) * 6,
          size: Math.random() * 3 + 2,
          life: 1,
          color,
        });
      }
    };

    const loop = () => {
      ctx.clearRect(0, 0, W, H);

      // Grid lines
      ctx.strokeStyle = '#1e1e24';
      ctx.lineWidth = 1;
      for (let x = 0; x < W; x += 36) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }
      for (let y = 0; y < H; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Acme Store Production Gateway on the left
      ctx.fillStyle = '#baf264';
      ctx.fillRect(0, 0, 14, H);

      const s = stateRef.current;
      if (s.gameState === 'playing') {
        s.spawnTimer++;
        if (s.spawnTimer > 35) {
          spawnBug();
          s.spawnTimer = 0;
        }

        // Render bugs
        for (let i = s.bugs.length - 1; i >= 0; i--) {
          const b = s.bugs[i];
          b.x -= b.speed;
          b.blink += 0.12;

          if (b.type === 'flaky' && Math.sin(b.blink) > 0.4) {
            ctx.globalAlpha = 0.25;
          } else {
            ctx.globalAlpha = 1;
          }

          // Bug Body
          ctx.fillStyle = b.color;
          ctx.beginPath();
          ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
          ctx.fill();

          // Bug antennae / legs
          ctx.strokeStyle = b.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(b.x - b.r, b.y - 4);
          ctx.lineTo(b.x - b.r - 4, b.y - 7);
          ctx.moveTo(b.x - b.r, b.y + 4);
          ctx.lineTo(b.x - b.r - 4, b.y + 7);
          ctx.moveTo(b.x + 2, b.y - b.r);
          ctx.lineTo(b.x + 5, b.y - b.r - 4);
          ctx.moveTo(b.x + 2, b.y + b.r);
          ctx.lineTo(b.x + 5, b.y + b.r + 4);
          ctx.stroke();

          ctx.globalAlpha = 1;

          // Infiltrate production
          if (b.x <= 20) {
            s.bugs.splice(i, 1);
            s.lives--;
            setLives(s.lives);
            addExplosion(20, b.y, '#e92e4a');
            if (s.lives <= 0) {
              s.gameState = 'over';
              setGameState('over');
              setBestScore((best) => Math.max(best, s.score));
            }
          }
        }

        // Particles
        for (let p = s.particles.length - 1; p >= 0; p--) {
          const pt = s.particles[p];
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life -= 0.04;
          if (pt.life <= 0) {
            s.particles.splice(p, 1);
          } else {
            ctx.fillStyle = pt.color;
            ctx.globalAlpha = pt.life;
            ctx.fillRect(pt.x, pt.y, pt.size, pt.size);
          }
        }
        ctx.globalAlpha = 1;
      }

      animId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    const s = stateRef.current;
    for (let i = s.bugs.length - 1; i >= 0; i--) {
      const b = s.bugs[i];
      const dist = Math.hypot(mx - b.x, my - b.y);
      if (dist < b.r + 16) {
        b.hp--;
        // add particles
        for (let p = 0; p < 8; p++) {
          s.particles.push({
            x: b.x,
            y: b.y,
            vx: (Math.random() - 0.5) * 6,
            vy: (Math.random() - 0.5) * 6,
            size: Math.random() * 3 + 2,
            life: 1,
            color: b.color,
          });
        }
        if (b.hp <= 0) {
          s.score += b.points;
          setScore(s.score);
          s.bugs.splice(i, 1);
        }
        break;
      }
    }
  };

  return (
    <section aria-labelledby="arcade-title" className="relative bg-midnight pt-12 text-canvas sm:pt-16 lg:pt-20" id="arcade">
      <div aria-hidden="true" className="pattern-dots-dark pointer-events-none absolute inset-0 opacity-60"></div>
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-12 relative">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="t-label flex items-center gap-2.5 text-space">
              <svg aria-hidden="true" className="size-3 shrink-0" viewBox="0 0 12 12">
                <rect fill="var(--color-lime)" height="6" opacity="1" rx="1.6" width="6" x="0" y="0" />
                <rect fill="var(--color-lime)" height="6" opacity="0.55" rx="1.6" width="6" x="6" y="6" />
              </svg>
              <span>Permainan Interaktif Opsional</span>
            </p>
            <h2 className="mt-6 font-mono text-[clamp(2rem,4vw,3.25rem)] font-bold uppercase leading-[0.95] tracking-tight" id="arcade-title">
              TAVI:
              <span className="block text-lime">PEMBURU BUG</span>
            </h2>
            <p className="mt-6 max-w-[38ch] text-[15px] leading-relaxed text-steel">
              Bugs are crawling toward the Acme store. Help Nico squash them before they reach production. Flaky ones blink.
              Regressions take two hits.
            </p>
            <dl className="mt-8 grid max-w-[340px] grid-cols-3 gap-3 font-mono text-[11px] uppercase tracking-wider">
              <div className="rounded-lg bg-phantom p-3 ring-1 ring-[var(--hairline-dark)]">
                <dt className="flex items-center gap-1.5 text-steel">
                  <span aria-hidden="true" className="size-2" style={{ background: 'rgb(233, 46, 74)' }}></span>
                  Bug
                </dt>
                <dd className="mt-1 text-[15px] font-bold text-canvas">+10</dd>
              </div>
              <div className="rounded-lg bg-phantom p-3 ring-1 ring-[var(--hairline-dark)]">
                <dt className="flex items-center gap-1.5 text-steel">
                  <span aria-hidden="true" className="size-2" style={{ background: 'rgb(243, 206, 58)' }}></span>
                  Flaky
                </dt>
                <dd className="mt-1 text-[15px] font-bold text-canvas">+25</dd>
              </div>
              <div className="rounded-lg bg-phantom p-3 ring-1 ring-[var(--hairline-dark)]">
                <dt className="flex items-center gap-1.5 text-steel">
                  <span aria-hidden="true" className="size-2" style={{ background: 'rgb(255, 112, 34)' }}></span>
                  Regression
                </dt>
                <dd className="mt-1 text-[15px] font-bold text-canvas">+40</dd>
              </div>
            </dl>
          </div>
          <div className="lg:col-span-8">
            <div className="rounded-[22px] bg-phantom p-3 ring-1 ring-[var(--hairline-dark)] sm:p-4">
              <div className="relative">
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 px-1 pb-3 font-mono text-[11px] uppercase tracking-wider text-steel">
                  <span>
                    Score{' '}
                    <span className="text-[14px] font-bold tabular-nums text-canvas">
                      {String(score).padStart(5, '0')}
                    </span>
                  </span>
                  <span>
                    Time{' '}
                    <span className="tabular-nums text-canvas">
                      {timeLeft}s
                    </span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    Prod
                    <span aria-hidden="true" className={`size-2.5 transition-colors ${lives >= 1 ? 'bg-lime' : 'bg-signal-red'}`}></span>
                    <span aria-hidden="true" className={`size-2.5 transition-colors ${lives >= 2 ? 'bg-lime' : 'bg-signal-red'}`}></span>
                    <span aria-hidden="true" className={`size-2.5 transition-colors ${lives >= 3 ? 'bg-lime' : 'bg-signal-red'}`}></span>
                    <span className="sr-only">{lives} lives</span>
                  </span>
                  <span className="ml-auto">
                    Best{' '}
                    <span className="tabular-nums text-canvas">
                      {String(bestScore).padStart(5, '0')}
                    </span>
                  </span>
                  <span className="flex gap-1.5">
                    <button
                      aria-label="Mute game sound"
                      aria-pressed={muted}
                      onClick={() => setMuted(!muted)}
                      className="grid size-7 place-items-center rounded-md bg-phantom text-canvas hover:bg-arsenic"
                      type="button"
                    >
                      <svg aria-hidden="true" className="lucide lucide-volume-2 size-3.5" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
                        <path d="M16 9a5 5 0 0 1 0 6" />
                        <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
                      </svg>
                    </button>
                  </span>
                </div>
                <div
                  aria-label="NICO: BUG HUNTER game. Click or tap bugs, or use arrow keys to aim and Space to zap. Press P to pause."
                  className="relative overflow-hidden rounded-xl ring-1 ring-[var(--hairline-dark)] focus-visible:ring-2 focus-visible:ring-lime"
                  role="application"
                  style={{ aspectRatio: '480 / 300' }}
                  tabIndex={0}
                >
                  <canvas
                    ref={canvasRef}
                    onClick={handleCanvasClick}
                    className="block size-full touch-none [image-rendering:pixelated]"
                  ></canvas>

                  {gameState !== 'playing' && (
                    <div className="absolute inset-0 grid place-items-center bg-midnight/85 p-4">
                      <div className="rise-in flex max-w-[420px] flex-col items-center text-center">
                        <div aria-label="TestPilot AI: Siap Menguji" className="relative isolate overflow-hidden hidden size-[72px] rounded-2xl sm:flex sm:size-[88px] items-center justify-center bg-midnight border border-white/10 shadow-lg" role="img">
                          {gameState === 'over' ? (
                            <svg className="size-10 text-signal-red" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <rect width="18" height="18" x="3" y="3" rx="2" />
                              <path d="m9 9 6 6" />
                              <path d="m15 9-6 6" />
                            </svg>
                          ) : (
                            <div className="relative flex items-center justify-center">
                              <div className="size-10 rounded-xl bg-sky/20 flex items-center justify-center border border-sky/40">
                                <svg className="size-6 text-sky" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <path d="M12 2v4" />
                                  <path d="m17 7 3-3" />
                                  <path d="M22 12h-4" />
                                  <path d="m17 17 3 3" />
                                  <path d="M12 22v-4" />
                                  <path d="m7 17-3 3" />
                                  <path d="M2 12h4" />
                                  <path d="m7 7-3-3" />
                                  <circle cx="12" cy="12" r="3" />
                                </svg>
                              </div>
                              <span className="absolute -top-1 -right-1 flex size-3">
                                <span className="animate-ping absolute inline-flex size-full rounded-full bg-lime opacity-75"></span>
                                <span className="relative inline-flex rounded-full size-3 bg-lime"></span>
                              </span>
                            </div>
                          )}
                        </div>
                        <p className="text-[15px] font-semibold leading-snug tracking-tight text-canvas sm:mt-4 sm:text-[22px]">
                          {gameState === 'over' ? (
                            <span>
                              <span className="text-signal-red font-bold text-xl block mb-1">BUGS REACHED PRODUCTION</span>
                              Final Score: {score}
                            </span>
                          ) : (
                            'Siap membasmi bug sistem?'
                          )}
                        </p>
                        <button
                          onClick={startGame}
                          className="mt-3 inline-flex h-10 items-center gap-2 rounded-full bg-lime px-5 sm:mt-5 sm:h-11 text-[14px] font-semibold text-ink transition-transform hover:scale-[1.03] active:scale-95"
                          type="button"
                        >
                          <svg aria-hidden="true" className="lucide lucide-play size-4 fill-current" fill="none" height="24" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
                          </svg>
                          {gameState === 'over' ? 'Main Lagi' : 'Mulai Permainan'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <p className="mt-3 flex flex-wrap justify-between gap-2 px-1 text-[12px] text-space">
                  <span>Lindungi server aplikasi demo Anda selama 45 detik.</span>
                  <span className="hidden sm:inline">Click or tap bugs · Arrows + Space · P to pause</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

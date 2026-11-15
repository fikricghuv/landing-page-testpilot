# 001 — Add scroll-reveal entrance animations to section titles and descriptions

- **Status**: DONE
- **Commit**: adbec85
- **Severity**: MEDIUM
- **Category**: Missed opportunities
- **Estimated scope**: 10 files (1 new hook `src/hooks/useScrollReveal.ts`, `src/index.css`, and 8 section components), ~150 lines changed

## Problem

`Hero` (`src/components/sections/Hero/Hero.tsx:14-76`) animates its eyebrow label, `<h1>` display title, and description paragraphs on mount using `.rise-in` and `.word-wrap`/`.rise-word`. However, all eight downstream landing sections render their eyebrow label, `<h2>` title, and description `<p>` completely static with no scroll-triggered entrance when they enter the viewport:

- `src/components/sections/Problem/Problem.tsx:51-67` (`#problem-title` + description)
- `src/components/sections/HowItWorks/HowItWorks.tsx:240-256` (`#how-title` + description)
- `src/components/sections/Product/Product.tsx:201-218` (`#product-title` + description)
- `src/components/sections/Traces/Traces.tsx:413-429` (`#traces-title` + description)
- `src/components/sections/Vision/Vision.tsx:387-406` (`#vision-title` + description)
- `src/components/sections/BuiltFor/BuiltFor.tsx:281-297` (`#built-title` + description)
- `src/components/sections/Showcase/Showcase.tsx:86-102` (`#showcase-title` + description)
- `src/components/sections/GetStarted/GetStarted.tsx:47-66` (`#cta-title` + description)

Current example (`src/components/sections/HowItWorks/HowItWorks.tsx:238-258`):

```tsx
<header className="grid gap-6 lg:grid-cols-12 lg:items-end">
  <div className="lg:col-span-8">
    <p className="t-label flex items-center gap-2.5 text-graphite">
      ...
      <span>HOW IT WORKS</span>
    </p>
    <h2 className="t-h2 mt-5 max-w-[24ch] text-ink" id="how-title">
      From Test Ideas to Actionable Results.
    </h2>
  </div>
  <div className="flex flex-col gap-5 lg:col-span-4 lg:pb-2">
    <p className="t-lede max-w-[46ch] text-graphite">
      TestPilot menghubungkan proses pembuatan test automation, eksekusi, hingga analisis hasil dalam satu workflow. Anda dapat memulai dari test case yang sudah tersedia, eksplorasi AI, atau interaksi browser yang direkam secara manual.
    </p>
  </div>
</header>
```

Because every other section has rich interactive demos and cards below the header, static section headings feel abrupt compared to `Hero`.

## Target

Each section header (`01` through `08`) reveals once when its `<header>` (or wrapper container) enters the viewport (`IntersectionObserver` with `threshold: 0.15`, `rootMargin: '0px 0px -8% 0px'`), then unobserves so content never disappears again when scrolling back up.

Exact motion values (extending existing repo tokens `--dur-slow: .56s` and `--ease-out-expo: cubic-bezier(.16, 1, .3, 1)`):

- **CSS classes** added to `src/index.css`:
  - `.scroll-reveal`: starts at `opacity: 0; transform: translateY(16px);`, transitions **only** `opacity` and `transform` (`transition: opacity var(--dur-slow) var(--ease-out-expo), transform var(--dur-slow) var(--ease-out-expo);`).
  - `.scroll-reveal[data-revealed="true"]`: `opacity: 1; transform: none;`.
  - **Stagger** via `data-reveal-delay` (or inline `style={{ transitionDelay: ... }}`):
    - Eyebrow label (`t-label`): `0ms`
    - Section title (`h2`): `60ms`
    - Section description (`p`): `120ms`
  - **Reduced motion** (`@media (prefers-reduced-motion: reduce)`):
    - Drops movement (`transform: none !important; transition-delay: 0ms !important;`) while keeping a subtle opacity fade (`transition: opacity 200ms ease;`).
    - In `useScrollReveal.ts`, if `window.matchMedia('(prefers-reduced-motion: reduce)').matches` or `typeof IntersectionObserver === 'undefined'`, initialize `isRevealed` to `true` immediately so headings are never stuck invisible.

```css
/* target in src/index.css */
.scroll-reveal {
  opacity: 0;
  transform: translateY(16px);
  transition: opacity var(--dur-slow) var(--ease-out-expo), transform var(--dur-slow) var(--ease-out-expo);
}
.scroll-reveal[data-revealed="true"] {
  opacity: 1;
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .scroll-reveal {
    transform: none !important;
    transition: opacity 200ms ease !important;
    transition-delay: 0ms !important;
  }
}
```

## Repo conventions to follow

- Existing easing and duration tokens in `src/index.css`:
  - `--ease-out-expo: cubic-bezier(.16, 1, .3, 1)`
  - `--dur-slow: .56s`
- Existing `IntersectionObserver` + `prefers-reduced-motion` pattern in `src/components/sections/Problem/Problem.tsx:9-38` and `src/components/sections/HowItWorks/HowItWorks.tsx:135-185`.
- Existing hero entrance exemplar in `src/components/sections/Hero/Hero.tsx:14-76`, where the eyebrow enters first (`0s`), followed by staggered title/description elements.

## Steps

1. **Create `src/hooks/useScrollReveal.ts`**:
   Export a reusable hook `useScrollReveal<T extends HTMLElement = HTMLElement>()` returning `{ ref, isRevealed }`:
   - Initialize `isRevealed` to `false` (or `true` if `typeof window === 'undefined'`, `typeof IntersectionObserver === 'undefined'`, or `window.matchMedia('(prefers-reduced-motion: reduce)').matches`).
   - In `useEffect`, if `isRevealed` is already `true` or `!ref.current`, return early.
   - Create an `IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setIsRevealed(true); observer.disconnect(); } }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' })`.
   - Clean up with `observer.disconnect()`.

2. **Add `.scroll-reveal` styles to `src/index.css`**:
   Append `.scroll-reveal`, `.scroll-reveal[data-revealed="true"]`, and the `@media (prefers-reduced-motion: reduce)` override at the end of `src/index.css` (after `.word-wrap:last-child`). Do NOT modify the existing `@media (prefers-reduced-motion: reduce)` rule inside the minified block earlier in `src/index.css`.

3. **Wire `useScrollReveal` into `src/components/sections/Problem/Problem.tsx`**:
   - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLDivElement>();`.
   - Wrap or attach `ref={headerRef}` to a `<div ref={headerRef}>` around lines 51-67 (the eyebrow `<p>`, `#problem-title` `<h2>`, and description `<p>`).
   - Add `scroll-reveal` class and `data-revealed={headerRevealed}` to:
     - Eyebrow `<p>` (line 51)
     - `#problem-title` `<h2>` (line 61) with `style={{ transitionDelay: '60ms' }}`
     - Description `<p>` (line 65) with `style={{ transitionDelay: '120ms' }}`

4. **Wire `useScrollReveal` into `src/components/sections/HowItWorks/HowItWorks.tsx`**:
   - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();`.
   - Attach `ref={headerRef}` to `<header ...>` at line 238.
   - Add `scroll-reveal` and `data-revealed={headerRevealed}` to:
     - Eyebrow `<p>` (line 240)
     - `#how-title` `<h2>` (line 249) with `style={{ transitionDelay: '60ms' }}`
     - Description `<p>` (line 254) with `style={{ transitionDelay: '120ms' }}`

5. **Wire `useScrollReveal` into `src/components/sections/Product/Product.tsx`**:
   - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();`.
   - Attach `ref={headerRef}` to `<header ...>` at line 199.
   - Add `scroll-reveal` and `data-revealed={headerRevealed}` to:
     - Eyebrow `<p>` (line 201)
     - `#product-title` `<h2>` (line 210) with `style={{ transitionDelay: '60ms' }}`
     - Description `<p>` (line 215) with `style={{ transitionDelay: '120ms' }}`

6. **Wire `useScrollReveal` into `src/components/sections/Traces/Traces.tsx`**:
   - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();`.
   - Attach `ref={headerRef}` to `<header ...>` at line 411.
   - Add `scroll-reveal` and `data-revealed={headerRevealed}` to:
     - Eyebrow `<p>` (line 413)
     - `#traces-title` `<h2>` (line 422) with `style={{ transitionDelay: '60ms' }}`
     - Description `<p>` (line 427) with `style={{ transitionDelay: '120ms' }}`

7. **Wire `useScrollReveal` into `src/components/sections/Vision/Vision.tsx`**:
   - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();`.
   - Attach `ref={headerRef}` to `<header ...>` at line 385.
   - Add `scroll-reveal` and `data-revealed={headerRevealed}` to:
     - Eyebrow `<p>` (line 387)
     - `#vision-title` `<h2>` (line 396) with `style={{ transitionDelay: '60ms' }}`
     - Description `<p>` (line 404) with `style={{ transitionDelay: '120ms' }}`

8. **Wire `useScrollReveal` into `src/components/sections/BuiltFor/BuiltFor.tsx`**:
   - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();`.
   - Attach `ref={headerRef}` to `<header ...>` at line 279.
   - Add `scroll-reveal` and `data-revealed={headerRevealed}` to:
     - Eyebrow `<p>` (line 281)
     - `#built-title` `<h2>` (line 290) with `style={{ transitionDelay: '60ms' }}`
     - Description `<p>` (line 295) with `style={{ transitionDelay: '120ms' }}`

9. **Wire `useScrollReveal` into `src/components/sections/Showcase/Showcase.tsx`**:
   - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLElement>();`.
   - Attach `ref={headerRef}` to `<header ...>` at line 84.
   - Add `scroll-reveal` and `data-revealed={headerRevealed}` to:
     - Eyebrow `<p>` (line 86)
     - `#showcase-title` `<h2>` (line 95) with `style={{ transitionDelay: '60ms' }}`
     - Description `<p>` (line 100) with `style={{ transitionDelay: '120ms' }}`

10. **Wire `useScrollReveal` into `src/components/sections/GetStarted/GetStarted.tsx`**:
    - Call `const { ref: headerRef, isRevealed: headerRevealed } = useScrollReveal<HTMLDivElement>();`.
    - Attach `ref={headerRef}` to the left column `<div className="min-w-0 lg:col-span-8">` at line 46.
    - Add `scroll-reveal` and `data-revealed={headerRevealed}` to:
      - Eyebrow `<p>` (line 47)
      - `#cta-title` `<h2>` (line 57) with `style={{ transitionDelay: '60ms' }}`
      - Description `<p>` (line 64) with `style={{ transitionDelay: '120ms' }}`

## Boundaries

- Do NOT touch `src/components/sections/Hero/Hero.tsx` (already animated on mount).
- Do NOT animate `width`, `height`, `margin`, `padding`, `top`, `left`, or use `transition: all`.
- Do NOT add new dependencies (no `framer-motion` or `aos`).
- Do NOT hide headings again after they have been revealed (observe once, disconnect on intersect).
- If any line numbers or class names differ from the snippets above, STOP and report instead of improvising.

## Verification

- **Mechanical**:
  - Run `npm run build` (`tsc && vite build`) — must exit 0 with zero TypeScript or Vite errors.
- **Feel check**:
  - Run `npm run dev` and scroll slowly from top (`Hero`) down through `#get-started`, then scroll back up:
    - Confirm every section's eyebrow, `<h2>` title, and description `<p>` rise smoothly into place (`0ms` -> `60ms` -> `120ms`) as they enter the viewport.
    - Confirm scrolling back up does NOT re-hide or flash any already-revealed heading.
    - In Chrome DevTools → **Animations**, set playback to 10% and confirm only `opacity` and `transform` animate with no layout shift.
    - In Chrome DevTools → **Rendering**, toggle `prefers-reduced-motion: reduce` and confirm headings appear immediately with no vertical movement.
- **Done when**: `npm run build` succeeds and all 8 downstream section headers (`Problem`, `HowItWorks`, `Product`, `Traces`, `Vision`, `BuiltFor`, `Showcase`, `GetStarted`) reveal cleanly on scroll with reduced-motion support.


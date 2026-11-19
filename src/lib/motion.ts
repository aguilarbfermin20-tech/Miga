/* Helpers de movimiento compartidos por todos los componentes. */

const reduceQuery = matchMedia('(prefers-reduced-motion: reduce)');

let reduced = reduceQuery.matches;
reduceQuery.addEventListener('change', (e) => {
  reduced = e.matches;
});

/** true si la persona pidió menos movimiento. Se actualiza en vivo. */
export const prefersReducedMotion = (): boolean => reduced;

export const clamp = (n: number, min: number, max: number): number =>
  Math.min(Math.max(n, min), max);

/* Un único listener de scroll { passive } que agenda un requestAnimationFrame. */
type ScrollCb = (y: number) => void;
const scrollCbs = new Set<ScrollCb>();
let scrollTicking = false;

function runScroll() {
  scrollTicking = false;
  const y = window.scrollY;
  scrollCbs.forEach((cb) => cb(y));
}

window.addEventListener(
  'scroll',
  () => {
    if (scrollTicking) return;
    scrollTicking = true;
    requestAnimationFrame(runScroll);
  },
  { passive: true },
);

/** Registra una función que corre una vez por frame mientras se scrollea (y ahora). */
export function onScroll(cb: ScrollCb): void {
  scrollCbs.add(cb);
  cb(window.scrollY);
}

/* Resize agrupado por frame. */
type ResizeCb = () => void;
const resizeCbs = new Set<ResizeCb>();
let resizeTicking = false;

window.addEventListener('resize', () => {
  if (resizeTicking) return;
  resizeTicking = true;
  requestAnimationFrame(() => {
    resizeTicking = false;
    resizeCbs.forEach((cb) => cb());
    runScroll();
  });
});

export function onResize(cb: ResizeCb): void {
  resizeCbs.add(cb);
}

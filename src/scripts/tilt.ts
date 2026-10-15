const MAX_SHIFT = 10;
const SMOOTHING = 0.06;
const REST_THRESHOLD = 0.0005;

export function initTilt() {
  const query = window.matchMedia(
    '(min-width: 1100px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)',
  );
  const layers = Array.from(document.querySelectorAll<HTMLElement>('[data-tilt]'));
  if (!layers.length) return;

  const target = { x: 0, y: 0 };
  const current = { x: 0, y: 0 };
  let frame = 0;
  let last = 0;

  function apply(layer: HTMLElement, x: number, y: number) {
    const shiftX = x * MAX_SHIFT;
    const shiftY = y * MAX_SHIFT;
    layer.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;
    layer.style.setProperty('--tilt-x', `${shiftX.toFixed(2)}px`);
    layer.style.setProperty('--tilt-y', `${shiftY.toFixed(2)}px`);
  }

  function reset() {
    cancelAnimationFrame(frame);
    frame = 0;
    target.x = target.y = current.x = current.y = 0;
    layers.forEach((layer) => {
      layer.style.removeProperty('transform');
      layer.style.removeProperty('--tilt-x');
      layer.style.removeProperty('--tilt-y');
    });
  }

  function tick(now: number) {
    const dt = last ? Math.min((now - last) / 16.67, 4) : 1;
    last = now;
    const ease = 1 - Math.pow(1 - SMOOTHING, dt);
    current.x += (target.x - current.x) * ease;
    current.y += (target.y - current.y) * ease;

    layers.forEach((layer) => apply(layer, current.x, current.y));

    const settled = Math.abs(target.x - current.x) < REST_THRESHOLD && Math.abs(target.y - current.y) < REST_THRESHOLD;
    frame = settled ? 0 : requestAnimationFrame(tick);
  }

  function wake() {
    if (frame || !query.matches) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || !query.matches) return;
    target.x = (event.clientX / window.innerWidth) * 2 - 1;
    target.y = (event.clientY / window.innerHeight) * 2 - 1;
    wake();
  });

  document.documentElement.addEventListener('pointerleave', () => {
    target.x = target.y = 0;
    wake();
  });

  window.addEventListener('blur', () => {
    target.x = target.y = 0;
    wake();
  });

  query.addEventListener('change', (event) => {
    if (!event.matches) reset();
  });
}

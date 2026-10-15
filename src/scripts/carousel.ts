import { gsap } from 'gsap';

const SWIPE_THRESHOLD = 40;
const AXIS_THRESHOLD = 8;

export function initCarousels() {
  document.querySelectorAll<HTMLElement>('[data-carousel]').forEach(setupCarousel);
}

function setupCarousel(root: HTMLElement) {
  const slides = Array.from(root.querySelectorAll<HTMLElement>('[data-slide]'));
  const dots = Array.from(root.querySelectorAll<HTMLButtonElement>('[data-carousel-dot]'));
  const viewport = root.querySelector<HTMLElement>('[data-carousel-viewport]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (slides.length < 2 || !viewport) return;

  let index = 0;
  let animation: gsap.core.Timeline | null = null;

  function show(next: number, direction: 1 | -1) {
    const target = (next + slides.length) % slides.length;
    if (target === index) return;

    animation?.progress(1);
    const from = slides[index];
    const to = slides[target];
    index = target;

    dots.forEach((dot, i) => (i === index ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
    from.inert = true;
    to.inert = false;
    to.classList.add('is-active');

    const parts = (slide: HTMLElement) =>
      gsap.utils.toArray<HTMLElement>(slide.querySelectorAll('[data-slide-media] img, [data-slide-infos] > *'));

    if (reduceMotion.matches) {
      from.classList.remove('is-active');
      return;
    }

    animation = gsap
      .timeline({
        defaults: { duration: 0.55, ease: 'power3.inOut' },
        onComplete: () => {
          from.classList.remove('is-active');
          gsap.set([...parts(from), ...parts(to)], { clearProps: 'all' });
        },
      })
      .to(parts(from), { xPercent: -direction * 40, opacity: 0, stagger: 0.04 })
      .fromTo(
        parts(to),
        { xPercent: direction * 40, opacity: 0 },
        { xPercent: 0, opacity: 1, stagger: 0.06, ease: 'power3.out', duration: 0.7 },
        0.2,
      );
  }

  root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => show(index - 1, -1));
  root.querySelector('[data-carousel-next]')?.addEventListener('click', () => show(index + 1, 1));
  dots.forEach((dot, i) => dot.addEventListener('click', () => show(i, i > index ? 1 : -1)));

  const html = document.documentElement;
  let startX = 0;
  let startY = 0;
  let tracking = false;
  let axis: 'x' | 'y' | null = null;
  let release = 0;

  function endGesture() {
    tracking = false;
    axis = null;
    window.clearTimeout(release);
    release = window.setTimeout(() => html.classList.remove('is-swiping'), 350);
  }

  viewport.addEventListener('pointerdown', (event) => {
    if (event.pointerType === 'mouse') return;
    tracking = true;
    axis = null;
    startX = event.clientX;
    startY = event.clientY;
  });

  viewport.addEventListener('pointermove', (event) => {
    if (!tracking || axis) return;
    const dx = Math.abs(event.clientX - startX);
    const dy = Math.abs(event.clientY - startY);
    if (Math.max(dx, dy) < AXIS_THRESHOLD) return;
    axis = dx > dy ? 'x' : 'y';
    if (axis === 'x') {
      window.clearTimeout(release);
      html.classList.add('is-swiping');
    }
  });

  viewport.addEventListener('pointerup', (event) => {
    if (!tracking) return;
    const horizontal = axis === 'x';
    const dx = event.clientX - startX;
    endGesture();
    if (!horizontal || Math.abs(dx) < SWIPE_THRESHOLD) return;
    show(index + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });

  viewport.addEventListener('pointercancel', endGesture);
}

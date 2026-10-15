import { gsap } from 'gsap';

export function initMenu() {
  const menu = document.querySelector<HTMLElement>('[data-menu]');
  const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
  const closeButton = menu?.querySelector<HTMLButtonElement>('[data-menu-close]');
  if (!menu || !openButton || !closeButton) return;

  const items = Array.from(menu.querySelectorAll<HTMLElement>('[data-menu-item]'));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let animation: gsap.core.Timeline | null = null;

  function open() {
    animation?.kill();
    menu!.hidden = false;
    root.classList.add('menu-open');
    openButton!.setAttribute('aria-expanded', 'true');
    closeButton!.focus();

    if (reduceMotion.matches) return;
    animation = gsap
      .timeline()
      .fromTo(menu, { yPercent: -100 }, { yPercent: 0, duration: 0.8, ease: 'expo.inOut' })
      .fromTo(items, { y: -40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9, stagger: 0.06, ease: 'expo.out' }, 0.35);
  }

  function close() {
    if (menu!.hidden) return;
    animation?.kill();
    root.classList.remove('menu-open');
    openButton!.setAttribute('aria-expanded', 'false');

    const done = () => {
      menu!.hidden = true;
      gsap.set([menu, ...items], { clearProps: 'all' });
    };

    if (reduceMotion.matches) {
      done();
      openButton!.focus();
      return;
    }
    animation = gsap.timeline({ onComplete: done }).to(menu, { yPercent: -100, duration: 0.7, ease: 'expo.inOut' });
  }

  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', () => {
    close();
    openButton.focus();
  });
  items.forEach((item) => item.addEventListener('click', close));
  window.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !menu.hidden) {
      close();
      openButton.focus();
    }
  });
  window.matchMedia('(min-width: 1100px)').addEventListener('change', (event) => event.matches && close());
}

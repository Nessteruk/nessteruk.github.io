import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { typeIntro } from './intro';

gsap.registerPlugin(Observer);

type Direction = 1 | -1;

const SHEET_DURATION = 0.6;
const SHEET_EASE = 'power3.inOut';
const SHEET_OFFSET = 30;
const COOLDOWN = 0.35;
const INNER_SCROLL_GRACE = 500;
const TYPING_SPEED = 0.045;
const REVEALS = {
  default: { shift: 90, duration: 1.3, ease: 'expo.out', stagger: 0.07 },
  subtle: { shift: 20, duration: 1.1, ease: 'power3.out', stagger: 0.08 },
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

export function initFullpage() {
  const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
  if (!sections.length) return;

  const themed = Array.from(document.querySelectorAll<HTMLElement>('[data-follow-theme]'));
  const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-nav-target]'));
  const reveals = new Map<HTMLElement, gsap.core.Timeline>();

  let current = Math.max(
    0,
    sections.findIndex((section) => `#${section.id}` === location.hash),
  );
  let locked = false;
  let lastInnerScroll = 0;

  sections.forEach((section, i) => {
    section.classList.toggle('is-active', i === current);
    section.inert = i !== current;
    inner(section).addEventListener('scroll', () => (lastInnerScroll = performance.now()), { passive: true });
  });

  applyTheme(sections[current]);
  reveal(sections[current], 1, 0.15);

  function inner(section: HTMLElement) {
    return section.querySelector<HTMLElement>('.section__inner') ?? section;
  }

  function isScrollable(el: HTMLElement) {
    return getComputedStyle(el).overflowY === 'auto' && el.scrollHeight - el.clientHeight >= 2;
  }

  function canScrollInside(direction: Direction) {
    const el = inner(sections[current]);
    if (!isScrollable(el)) return false;
    return direction === 1 ? el.scrollTop + el.clientHeight < el.scrollHeight - 2 : el.scrollTop > 2;
  }

  function applyTheme(section: HTMLElement) {
    const theme = section.dataset.theme ?? 'light';
    themed.forEach((el) => (el.dataset.theme = theme));
    navLinks.forEach((link) => {
      const group = (link.dataset.navGroup ?? '').split(',');
      if (group.includes(section.id)) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function depth(el: Element) {
    return Number((el as HTMLElement).dataset.reveal) || 1;
  }

  function typeSpeech(speech: HTMLElement) {
    const typed = speech.querySelector<HTMLElement>('[data-speech-typed]');
    const text = speech.dataset.speech ?? '';
    if (!typed) return gsap.timeline();

    const state = { chars: 0 };
    typed.textContent = '';
    speech.dataset.typed = 'true';

    return gsap
      .timeline({
        onStart: () => speech.classList.add('is-typing'),
        onComplete: () => speech.classList.remove('is-typing'),
      })
      .to(state, {
        chars: text.length,
        duration: text.length * TYPING_SPEED,
        ease: 'none',
        delay: 0.45,
        onUpdate: () => {
          typed.textContent = text.slice(0, Math.round(state.chars));
        },
      });
  }

  function reveal(section: HTMLElement, direction: Direction, delay: number) {
    reveals.get(section)?.progress(1).kill();

    const items = Array.from(section.querySelectorAll<HTMLElement>('[data-reveal]'));
    const speech = section.querySelector<HTMLElement>('[data-speech]');
    const intro = section.querySelector<HTMLElement>('[data-intro]');
    const willTypeIntro = !!intro && intro.dataset.typed !== 'true';

    if (reduceMotion.matches) {
      gsap.set(items, { clearProps: 'opacity,transform' });
      if (willTypeIntro && intro) typeIntro(intro);
      return;
    }

    const willTypeSpeech = !!speech && speech.dataset.typed !== 'true';
    const willType = willTypeSpeech || willTypeIntro;
    const tl = gsap.timeline({ delay });

    gsap.set(items, { opacity: 0 });
    if (willTypeSpeech && speech) {
      speech.querySelector('[data-speech-typed]')!.textContent = '';
      tl.add(typeSpeech(speech));
    }
    if (willTypeIntro && intro) {
      tl.add(typeIntro(intro));
    }

    const style = section.dataset.revealStyle === 'subtle' ? REVEALS.subtle : REVEALS.default;
    tl.fromTo(
      items,
      { opacity: 0, y: (_: number, el: Element) => direction * depth(el) * style.shift },
      {
        opacity: 1,
        y: 0,
        duration: style.duration,
        ease: style.ease,
        stagger: style.stagger,
        clearProps: 'transform',
      },
      willType ? '+=0.1' : 0,
    );

    reveals.set(section, tl);
  }

  function goTo(index: number) {
    if (locked || index === current || index < 0 || index >= sections.length) return;

    const from = sections[current];
    const to = sections[index];
    const direction: Direction = index > current ? 1 : -1;

    current = index;
    locked = true;
    reveals.get(from)?.progress(1);

    to.classList.add('is-active');
    to.inert = false;
    from.inert = true;
    const toInner = inner(to);
    toInner.scrollTop = direction === 1 || !isScrollable(toInner) ? 0 : toInner.scrollHeight;
    history.replaceState(null, '', `#${to.id}`);

    const sheet = direction === 1 ? to : from;
    sheet.classList.toggle('has-shadow', from.dataset.theme !== to.dataset.theme);

    const finish = () => {
      sheet.classList.remove('has-shadow');
      from.classList.remove('is-active');
      gsap.set([from, to], { clearProps: 'transform,zIndex' });
      gsap.delayedCall(reduceMotion.matches ? 0 : COOLDOWN, () => (locked = false));
    };

    if (reduceMotion.matches) {
      applyTheme(to);
      reveal(to, direction, 0);
      finish();
      return;
    }

    const tl = gsap.timeline({
      defaults: { duration: SHEET_DURATION, ease: SHEET_EASE },
      onComplete: finish,
    });

    if (direction === 1) {
      gsap.set(from, { zIndex: 1 });
      gsap.set(to, { zIndex: 2, yPercent: 100 });
      tl.to(to, { yPercent: 0 }).to(from, { yPercent: -SHEET_OFFSET }, 0);
    } else {
      gsap.set(from, { zIndex: 2 });
      gsap.set(to, { zIndex: 1, yPercent: -SHEET_OFFSET });
      tl.to(from, { yPercent: 100 }).to(to, { yPercent: 0 }, 0);
    }

    tl.call(() => applyTheme(to), undefined, SHEET_DURATION * (direction === 1 ? 0.8 : 0.2));
    reveal(to, direction, SHEET_DURATION * 0.35);
  }

  function step(direction: Direction) {
    const root = document.documentElement;
    if (root.classList.contains('menu-open') || root.classList.contains('is-swiping')) return;
    if (canScrollInside(direction) || performance.now() - lastInnerScroll < INNER_SCROLL_GRACE) return;
    goTo(current + direction);
  }

  Observer.create({
    target: window,
    type: 'wheel,touch',
    wheelSpeed: -1,
    tolerance: 10,
    lockAxis: true,
    onUp: () => step(1),
    onDown: () => step(-1),
  });

  window.addEventListener('keydown', (event) => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('input, textarea, select, [contenteditable]')) return;

    const keys: Record<string, () => void> = {
      ArrowDown: () => step(1),
      PageDown: () => step(1),
      ArrowUp: () => step(-1),
      PageUp: () => step(-1),
      Home: () => goTo(0),
      End: () => goTo(sections.length - 1),
      ' ': () => step(event.shiftKey ? -1 : 1),
    };
    const action = keys[event.key];
    if (!action) return;
    if (event.key === ' ' && target?.closest('button, a')) return;

    const scrollable = canScrollInside(event.key === 'ArrowUp' || event.key === 'PageUp' || (event.key === ' ' && event.shiftKey) ? -1 : 1);
    if (scrollable && event.key !== 'Home' && event.key !== 'End') return;

    event.preventDefault();
    action();
  });

  navLinks.forEach((link) =>
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const index = sections.findIndex((section) => section.id === link.dataset.navTarget);
      goTo(index);
    }),
  );
}

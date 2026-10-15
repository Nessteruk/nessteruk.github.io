import { gsap } from 'gsap';

const TYPE_SPEED = 0.05;
const DELETE_SPEED = 0.035;
const SWEEP_DURATION = 0.45;
const ROLE_HOLD = 4;

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function typeTo(node: Text, from: string, to: string, speed: number) {
  const state = { chars: from.length };
  const text = to.length >= from.length ? to : from;
  return gsap.to(state, {
    chars: to.length,
    duration: Math.abs(to.length - from.length) * speed,
    ease: 'none',
    onUpdate: () => {
      node.data = text.slice(0, Math.round(state.chars));
    },
  });
}

export function typeIntro(root: HTMLElement) {
  const lead = root.querySelector<HTMLElement>('[data-intro-lead]');
  const highlight = root.querySelector<HTMLElement>('[data-intro-highlight]');
  const role = root.querySelector<HTMLElement>('[data-intro-role]');
  const roles: string[] = JSON.parse(root.dataset.roles ?? '[]');
  if (!lead || !highlight || !role || !roles.length) return gsap.timeline();

  root.dataset.typed = 'true';
  const leadText = lead.dataset.text ?? '';
  const caret = document.createElement('span');
  caret.className = 'caret';
  const leadNode = document.createTextNode('');
  const roleNode = document.createTextNode('');
  let current = 0;

  if (reduceMotion.matches) {
    lead.textContent = leadText;
    role.textContent = roles[0];
    gsap.delayedCall(ROLE_HOLD, function swap() {
      current = (current + 1) % roles.length;
      role.textContent = roles[current];
      gsap.delayedCall(ROLE_HOLD, swap);
    });
    return gsap.timeline();
  }

  lead.replaceChildren(leadNode, caret);
  role.replaceChildren(roleNode);
  gsap.set(highlight, { '--hl': 0 });

  const typing = (on: boolean) => () => root.classList.toggle('is-typing', on);

  function rotate() {
    const from = roles[current];
    current = (current + 1) % roles.length;
    const to = roles[current];
    gsap
      .timeline({ onComplete: () => gsap.delayedCall(ROLE_HOLD, rotate) })
      .to(highlight, { '--hl': 0, duration: SWEEP_DURATION, ease: 'power2.inOut' })
      .call(typing(true))
      .add(typeTo(roleNode, from, '', DELETE_SPEED))
      .add(typeTo(roleNode, '', to, TYPE_SPEED), '+=0.2')
      .call(typing(false))
      .to(highlight, { '--hl': 1, duration: SWEEP_DURATION, ease: 'power2.inOut' }, '+=0.15');
  }

  return gsap
    .timeline({ onComplete: () => gsap.delayedCall(ROLE_HOLD, rotate) })
    .call(typing(true), undefined, 0.45)
    .add(typeTo(leadNode, '', leadText, TYPE_SPEED))
    .call(() => role.append(caret))
    .add(typeTo(roleNode, '', roles[0], TYPE_SPEED), '+=0.05')
    .call(typing(false))
    .to(highlight, { '--hl': 1, duration: SWEEP_DURATION, ease: 'power2.inOut' }, '+=0.15');
}

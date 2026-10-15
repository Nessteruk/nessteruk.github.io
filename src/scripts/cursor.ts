const HOVER_TARGETS = 'a, button, label, select, summary, [role="button"]';
const TEXT_TARGETS = 'p, h1, h2, h3, h4, li, span';

type CursorState = 'default' | 'hover' | 'text';

function caretAt(x: number, y: number): { node: Node; offset: number } | null {
  if (document.caretPositionFromPoint) {
    const position = document.caretPositionFromPoint(x, y);
    return position ? { node: position.offsetNode, offset: position.offset } : null;
  }
  const range = document.caretRangeFromPoint?.(x, y);
  return range ? { node: range.startContainer, offset: range.startOffset } : null;
}

function isOverText(x: number, y: number) {
  const caret = caretAt(x, y);
  if (!caret || caret.node.nodeType !== Node.TEXT_NODE) return false;
  const text = caret.node as Text;
  if (!text.parentElement?.closest(TEXT_TARGETS)) return false;

  const range = document.createRange();
  range.setStart(text, Math.max(0, caret.offset - 1));
  range.setEnd(text, Math.min(text.length, caret.offset + 1));
  return Array.from(range.getClientRects()).some(
    (rect) => x >= rect.left - 2 && x <= rect.right + 2 && y >= rect.top && y <= rect.bottom,
  );
}

export function initCursor() {
  const cursor = document.querySelector<HTMLElement>('[data-cursor]');
  if (!cursor) return;

  const query = window.matchMedia('(hover: hover) and (pointer: fine)');
  const root = document.documentElement;
  let x = 0;
  let y = 0;
  let target: EventTarget | null = null;
  let frame = 0;

  function state(): CursorState {
    if (target instanceof Element && target.closest(HOVER_TARGETS)) return 'hover';
    return isOverText(x, y) ? 'text' : 'default';
  }

  function render() {
    frame = 0;
    cursor!.style.transform = `translate3d(${Math.round(x)}px, ${Math.round(y)}px, 0)`;
    cursor!.dataset.state = state();
  }

  function enable(on: boolean) {
    root.classList.toggle('has-cursor', on);
    if (!on) cursor!.classList.remove('is-visible');
  }

  window.addEventListener('pointermove', (event) => {
    if (event.pointerType !== 'mouse' || !query.matches) return;
    x = event.clientX;
    y = event.clientY;
    target = event.target;
    cursor.classList.add('is-visible');
    if (!frame) frame = requestAnimationFrame(render);
  });

  root.addEventListener('pointerleave', () => cursor.classList.remove('is-visible'));
  window.addEventListener('blur', () => cursor.classList.remove('is-visible'));

  enable(query.matches);
  query.addEventListener('change', (event) => enable(event.matches));
}

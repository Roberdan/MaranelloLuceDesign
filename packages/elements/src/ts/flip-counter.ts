/**
 * Maranello Luce Design - Animated flip counter (DOM-based)
 */
import type { FlipCounterOptions } from './core/types';

interface FlipCounterController {
  setValue: (v: number) => void;
  getValue: () => number;
  increment: (by?: number) => void;
  decrement: (by?: number) => void;
}

/** Create an animated flip counter inside a container element. */
export function flipCounter(
  containerEl: HTMLElement,
  opts?: FlipCounterOptions,
): FlipCounterController {
  const o = {
    value: 0, digits: 4, decimals: 0, separator: '',
    prefix: '', suffix: '', animationDuration: 500, padZero: true,
    ...opts,
  };

  let currentValue = o.value;

  function formatValue(val: number): string {
    let str = o.decimals > 0 ? val.toFixed(o.decimals) : String(Math.round(val));
    if (o.padZero) {
      const parts = str.split('.');
      while (parts[0].length < o.digits) parts[0] = '0' + parts[0];
      str = parts.join('.');
    }
    return str;
  }

  function buildDOM(valueStr: string): void {
    containerEl.innerHTML = '';
    containerEl.className = (
      containerEl.className.replace(/\bmn-flip-counter[^\s]*/g, '') +
      ' mn-flip-counter'
    ).trim();

    if (o.prefix) {
      const pre = document.createElement('span');
      pre.className = 'mn-flip-counter__sep';
      pre.textContent = o.prefix;
      containerEl.appendChild(pre);
    }

    for (let i = 0; i < valueStr.length; i++) {
      const ch = valueStr[i];
      if (ch === '.' || ch === ',' || ch === ':') {
        const sep = document.createElement('span');
        sep.className = 'mn-flip-counter__sep';
        sep.textContent = ch;
        containerEl.appendChild(sep);
      } else {
        const digit = document.createElement('div');
        digit.className = 'mn-flip-counter__digit';
        const inner = document.createElement('div');
        inner.className = 'mn-flip-counter__digit-inner';
        for (let d = 0; d <= 9; d++) {
          const face = document.createElement('div');
          face.className = 'mn-flip-counter__digit-face';
          face.textContent = String(d);
          inner.appendChild(face);
        }
        digit.appendChild(inner);
        containerEl.appendChild(digit);
        const numVal = parseInt(ch, 10) || 0;
        inner.style.transform = 'translateY(-' + (numVal * 52) + 'px)';
        inner.dataset.current = String(numVal);
      }
    }

    if (o.suffix) {
      const suf = document.createElement('span');
      suf.className = 'mn-flip-counter__sep';
      suf.textContent = o.suffix;
      containerEl.appendChild(suf);
    }
  }

  function animateTo(newValue: number): void {
    const valueStr = formatValue(newValue);
    const inners = containerEl.querySelectorAll(
      '.mn-flip-counter__digit-inner',
    ) as NodeListOf<HTMLElement>;
    const digitChars = valueStr.replace(/[^0-9]/g, '');

    if (inners.length !== digitChars.length) {
      buildDOM(valueStr);
      currentValue = newValue;
      return;
    }

    for (let i = 0; i < inners.length; i++) {
      const target = parseInt(digitChars[i], 10) || 0;
      const face = inners[i].querySelector(
        '.mn-flip-counter__digit-face',
      ) as HTMLElement | null;
      const digitH = face?.offsetHeight || 52;
      inners[i].style.transform = 'translateY(-' + (target * digitH) + 'px)';
      inners[i].dataset.current = String(target);
    }
    currentValue = newValue;
  }

  buildDOM(formatValue(currentValue));

  return {
    setValue: animateTo,
    getValue: () => currentValue,
    increment: (by?: number) => animateTo(currentValue + (by ?? 1)),
    decrement: (by?: number) => animateTo(currentValue - (by ?? 1)),
  };
}

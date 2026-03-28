export interface FacetKeyboardController {
  destroy(): void;
}

function isOptionElement(el: HTMLElement): boolean {
  return el.classList.contains('mn-facet__option-input') || el.classList.contains('mn-facet__option-button');
}

function focusOption(current: HTMLElement, direction: 1 | -1): void {
  const body = current.closest('.mn-facet__body');
  if (!body) return;
  const options = Array.from(body.querySelectorAll<HTMLElement>('.mn-facet__option-input, .mn-facet__option-button'));
  if (!options.length) return;
  const idx = options.indexOf(current);
  const next = idx < 0 ? options[0] : options[(idx + direction + options.length) % options.length];
  next.focus();
}

function closeFacetFromNode(node: HTMLElement): void {
  const section = node.closest<HTMLElement>('.mn-facet');
  if (!section) return;
  section.classList.add('mn-facet--collapsed');
  const header = section.querySelector<HTMLButtonElement>('.mn-facet__header');
  const body = section.querySelector<HTMLElement>('.mn-facet__body');
  if (header && body) {
    header.setAttribute('aria-expanded', 'false');
    body.hidden = true;
    header.focus();
  }
}

export function bindFacetWorkbenchKeyboard(root: HTMLElement): FacetKeyboardController {
  const onKeyDown = (event: KeyboardEvent): void => {
    const target = event.target as HTMLElement | null;
    if (!target) return;

    if (target.classList.contains('mn-facet__header') && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      target.click();
      return;
    }

    if (!isOptionElement(target)) {
      if (event.key === 'Escape') closeFacetFromNode(target);
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      focusOption(target, 1);
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      focusOption(target, -1);
      return;
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      if (target instanceof HTMLInputElement && (target.type === 'checkbox' || target.type === 'radio')) {
        target.checked = target.type === 'radio' ? true : !target.checked;
        target.dispatchEvent(new Event('change', { bubbles: true }));
      } else {
        target.click();
      }
      return;
    }

    if (event.key === 'Escape') {
      event.preventDefault();
      closeFacetFromNode(target);
    }
  };

  root.addEventListener('keydown', onKeyDown);
  return {
    destroy() {
      root.removeEventListener('keydown', onKeyDown);
    },
  };
}

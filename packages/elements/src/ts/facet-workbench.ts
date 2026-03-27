import {
  buildWorkbenchShell, createFacetSection, renderActiveChips, renderBoolean, renderDateRange,
  renderLoading, renderOptionRows, renderSearchControls, setFacetCollapsed, setFacetDisabled,
} from './facet-workbench-render';
import type { FacetConfig, FacetOption, FacetType, FacetSectionRefs } from './facet-workbench-render';
import { bindFacetWorkbenchKeyboard } from './facet-workbench-keyboard';

export type { FacetOption, FacetType, FacetConfig };

export interface FacetPreset {
  name: string;
  filters: Map<string, string[]>;
}

export interface FacetWorkbenchOptions {
  facets: FacetConfig[];
  onFilterChange?: (activeFilters: Map<string, string[]>) => void;
  presets?: FacetPreset[];
}

export class FacetWorkbench {
  private readonly facets = new Map<string, FacetSectionRefs>();
  private readonly loadedOptions = new Map<string, FacetOption[]>();
  private readonly filters = new Map<string, string[]>();
  private readonly presets: FacetPreset[];
  private readonly chips: HTMLElement;
  private readonly list: HTMLElement;
  private readonly keyboard;
  private searchTimers = new Map<string, number>();

  constructor(private readonly container: HTMLElement, private readonly options: FacetWorkbenchOptions) {
    this.presets = (options.presets || []).map((preset) => ({ name: preset.name, filters: cloneFilters(preset.filters) }));
    const shell = buildWorkbenchShell(container);
    this.list = shell.list;
    this.chips = shell.chips;
    this.keyboard = bindFacetWorkbenchKeyboard(shell.root);
    this.renderSkeleton();
    void this.loadFacetData();
  }

  getActiveFilters(): Map<string, string[]> { return cloneFilters(this.filters); }

  clearAll(): void { this.filters.clear(); this.syncUiFromFilters(); this.commitFilters(); }

  clearFacet(id: string): void { this.filters.delete(id); this.syncUiFromFilters(); this.commitFilters(); }

  savePreset(name: string): FacetPreset {
    const preset = { name, filters: this.getActiveFilters() };
    const idx = this.presets.findIndex((item) => item.name === name);
    if (idx >= 0) this.presets[idx] = preset;
    else this.presets.push(preset);
    return { name, filters: cloneFilters(preset.filters) };
  }

  loadPreset(name: string): void {
    const preset = this.presets.find((item) => item.name === name);
    if (!preset) return;
    this.filters.clear();
    preset.filters.forEach((values, key) => this.filters.set(key, [...values]));
    this.syncUiFromFilters();
    this.commitFilters();
  }

  listPresets(): ReadonlyArray<FacetPreset> {
    return this.presets.map((item) => ({ name: item.name, filters: cloneFilters(item.filters) }));
  }

  destroy(): void {
    this.searchTimers.forEach((timer) => window.clearTimeout(timer));
    this.keyboard.destroy();
    this.container.innerHTML = '';
  }

  private renderSkeleton(): void {
    this.options.facets.forEach((facet) => {
      const refs = createFacetSection(facet);
      this.facets.set(facet.id, refs);
      refs.header.addEventListener('click', () => {
        setFacetCollapsed(refs, !refs.section.classList.contains('mn-facet--collapsed'));
      });
      renderLoading(refs.body);
      this.list.appendChild(refs.section);
    });
    this.refreshChips();
  }

  private async loadFacetData(): Promise<void> {
    await Promise.all(this.options.facets.map(async (facet) => {
      const refs = this.facets.get(facet.id);
      if (!refs) return;
      const needsData = facet.type === 'select' || facet.type === 'multi-select' || facet.type === 'search';
      this.loadedOptions.set(facet.id, needsData ? await facet.dataProvider() : []);
      this.renderFacetBody(facet, refs);
    }));
    this.applyExclusions();
    this.refreshChips();
  }

  private renderFacetBody(facet: FacetConfig, refs: FacetSectionRefs): void {
    const selected = this.filters.get(facet.id) || [];
    if (facet.type === 'date-range') {
      const { from, to } = renderDateRange(refs.body, selected);
      const onChange = (): void => this.setFacetValues(facet.id, [from.value, to.value].filter(Boolean));
      from.addEventListener('change', onChange);
      to.addEventListener('change', onChange);
      return;
    }
    if (facet.type === 'boolean') {
      const control = renderBoolean(refs.body, selected.includes('true'));
      control.addEventListener('change', () => this.setFacetValues(facet.id, control.checked ? ['true'] : []));
      return;
    }

    const options = this.loadedOptions.get(facet.id) || [];
    renderOptionRows(refs.body, facet, options, selected);
    if (facet.type === 'search') {
      const search = renderSearchControls(refs.body);
      search.addEventListener('input', () => {
        const prior = this.searchTimers.get(facet.id);
        if (prior) window.clearTimeout(prior);
        const timer = window.setTimeout(() => {
          const q = search.value.trim().toLowerCase();
          renderOptionRows(refs.body, facet, options.filter((opt) => opt.label.toLowerCase().includes(q)), this.filters.get(facet.id) || []);
          refs.body.prepend(search);
          this.attachOptionChange(facet);
        }, 180);
        this.searchTimers.set(facet.id, timer);
      });
    }
    this.attachOptionChange(facet);
  }

  private attachOptionChange(facet: FacetConfig): void {
    const refs = this.facets.get(facet.id);
    if (!refs) return;
    refs.body.querySelectorAll<HTMLInputElement>('.mn-facet__option-input').forEach((input) => {
      input.addEventListener('change', () => {
        const checked = Array.from(refs.body.querySelectorAll<HTMLInputElement>('.mn-facet__option-input:checked')).map((n) => n.value);
        this.setFacetValues(facet.id, facet.type === 'select' ? checked.slice(0, 1) : checked);
      });
    });
  }

  private removeChipValue(facetId: string, value: string): void {
    this.setFacetValues(facetId, (this.filters.get(facetId) || []).filter((item) => item !== value));
  }

  private setFacetValues(id: string, values: string[]): void {
    if (values.length) this.filters.set(id, [...values]);
    else this.filters.delete(id);
    this.syncUiFromFilters();
    this.commitFilters();
  }

  private syncUiFromFilters(): void {
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (refs) this.renderFacetBody(facet, refs);
    });
    this.applyExclusions();
    this.refreshChips();
  }

  private applyExclusions(): void {
    const disabled = new Set<string>();
    this.options.facets.forEach((facet) => {
      if (this.filters.get(facet.id)?.length) facet.exclusionRules?.excludes.forEach((id) => disabled.add(id));
    });
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (refs) setFacetDisabled(refs.section, disabled.has(facet.id));
    });
  }

  private refreshChips(): void {
    renderActiveChips(this.chips, this.options.facets, this.filters, (facetId, value) => this.removeChipValue(facetId, value));
  }

  private commitFilters(): void {
    this.options.facets.forEach((facet) => {
      const refs = this.facets.get(facet.id);
      if (!refs || !facet.countProvider) return;
      void facet.countProvider(this.getActiveFilters()).then((count) => {
        refs.count.textContent = Number.isFinite(count) ? `${count}` : '';
      }).catch(() => { refs.count.textContent = ''; });
    });
    this.options.onFilterChange?.(this.getActiveFilters());
  }
}

function cloneFilters(source: ReadonlyMap<string, string[]>): Map<string, string[]> {
  const out = new Map<string, string[]>();
  source.forEach((values, key) => out.set(key, [...values]));
  return out;
}

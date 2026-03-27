export interface MnLocale {
  themes?: {
    editorial?: string;
    nero?: string;
    avorio?: string;
    colorblind?: string;
    sugar?: string;
  };
  filterPanel?: {
    saveDefault?: string;
    clear?: string;
  };
  a11y?: {
    display?: string;
    textSize?: string;
    lineSpacing?: string;
    dyslexiaFont?: string;
    reducedMotion?: string;
    highContrast?: string;
    focusIndicators?: string;
    resetDefaults?: string;
  };
  stateScaffold?: {
    loading?: string;
    noResults?: string;
    retry?: string;
    error?: string;
    empty?: string;
    partial?: string;
  };
}

/** Fully resolved locale — all keys guaranteed present after merge with defaults. */
export interface ResolvedMnLocale {
  themes: Required<NonNullable<MnLocale['themes']>>;
  filterPanel: Required<NonNullable<MnLocale['filterPanel']>>;
  a11y: Required<NonNullable<MnLocale['a11y']>>;
  stateScaffold: Required<NonNullable<MnLocale['stateScaffold']>>;
}

const defaults: ResolvedMnLocale = {
  themes: {
    editorial: 'Editorial',
    nero: 'Nero',
    avorio: 'Avorio',
    colorblind: 'Colorblind',
    sugar: 'Sugar',
  },
  filterPanel: {
    saveDefault: 'SAVE AS DEFAULT',
    clear: 'CLEAR',
  },
  a11y: {
    display: 'Display',
    textSize: 'Text Size',
    lineSpacing: 'Line Spacing',
    dyslexiaFont: 'Dyslexia Font',
    reducedMotion: 'Reduced Motion',
    highContrast: 'High Contrast',
    focusIndicators: 'Focus Indicators',
    resetDefaults: 'Reset to Defaults',
  },
  stateScaffold: {
    loading: 'Loading...',
    noResults: 'No results match your filters.',
    retry: 'Retry',
    error: 'Something went wrong. Please try again.',
    empty: 'No data available yet.',
    partial: 'Some data may be unavailable right now.',
  },
};

let current: ResolvedMnLocale = JSON.parse(JSON.stringify(defaults));

export function setLocale(locale: MnLocale): void {
  current = {
    themes: { ...defaults.themes, ...locale.themes },
    filterPanel: { ...defaults.filterPanel, ...locale.filterPanel },
    a11y: { ...defaults.a11y, ...locale.a11y },
    stateScaffold: { ...defaults.stateScaffold, ...locale.stateScaffold },
  };
}

export function getLocale(): Readonly<ResolvedMnLocale> {
  return current;
}

export function resetLocale(): void {
  current = JSON.parse(JSON.stringify(defaults));
}

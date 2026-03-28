/**
 * @convergio/design-elements — headless factory export tests.
 * Verifies that the public API surface is intact.
 */
import { describe, it, expect } from 'vitest';

import * as elements from '../src/ts/index';

describe('@convergio/design-elements barrel exports', () => {
  it('exports kanbanBoard as a function', () => {
    expect(elements.kanbanBoard).toBeDefined();
    expect(typeof elements.kanbanBoard).toBe('function');
  });

  it('exports FerrariGauge constructor', () => {
    expect(elements.FerrariGauge).toBeDefined();
    expect(typeof elements.FerrariGauge).toBe('function');
  });

  it('exports gantt factory', () => {
    expect(elements.gantt).toBeDefined();
    expect(typeof elements.gantt).toBe('function');
  });

  it('exports dataTable factory', () => {
    expect(elements.dataTable).toBeDefined();
    expect(typeof elements.dataTable).toBe('function');
  });

  it('exports buildUI as the AI chat entry point', () => {
    expect(elements.buildUI).toBeDefined();
    expect(typeof elements.buildUI).toBe('function');
  });

  it('exports voiceManager as a function', () => {
    expect(elements.voiceManager).toBeDefined();
    expect(typeof elements.voiceManager).toBe('function');
  });

  it('exports createRealtimeAdapter as a function', () => {
    expect(elements.createRealtimeAdapter).toBeDefined();
    expect(typeof elements.createRealtimeAdapter).toBe('function');
  });

  it('exports DashboardRenderer class', () => {
    expect(elements.DashboardRenderer).toBeDefined();
    expect(typeof elements.DashboardRenderer).toBe('function');
  });

  it('exports FacetWorkbench class', () => {
    expect(elements.FacetWorkbench).toBeDefined();
    expect(typeof elements.FacetWorkbench).toBe('function');
  });

  it('exports EntityWorkbench class', () => {
    expect(elements.EntityWorkbench).toBeDefined();
    expect(typeof elements.EntityWorkbench).toBe('function');
  });

  it('exports AsyncSelect class', () => {
    expect(elements.AsyncSelect).toBeDefined();
    expect(typeof elements.AsyncSelect).toBe('function');
  });

  it('exports VERSION string', () => {
    expect(elements.VERSION).toBeDefined();
    expect(typeof elements.VERSION).toBe('string');
  });
});

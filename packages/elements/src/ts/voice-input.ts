/**
 * Maranello Luce Design - Voice adapter framework.
 * Provides a pluggable voice-input system with state machine management.
 */

/** Voice adapter state machine states. */
export type VoiceState = 'idle' | 'listening' | 'processing' | 'error';

/** Events emitted by the voice system. */
export interface VoiceEvents {
  onStateChange?: (state: VoiceState) => void;
  onTranscript?: (text: string, isFinal: boolean) => void;
  onError?: (error: Error) => void;
}

/** Configuration passed to adapter.start(). */
export interface VoiceStartConfig {
  locale?: string;
  continuous?: boolean;
  interimResults?: boolean;
}

/**
 * Interface consumers implement for their speech provider.
 * Adapters wrap a specific speech API (Web Speech, GPT Realtime, Whisper, etc.)
 * behind a uniform contract.
 */
export interface VoiceAdapter {
  /** Provider name (e.g. 'gpt-realtime', 'web-speech', 'whisper'). */
  readonly name: string;
  /** Start listening with config. */
  start(config: VoiceStartConfig): void;
  /** Stop listening. */
  stop(): void;
  /** Check if this adapter works in the current environment. */
  isSupported(): boolean;
  /** Clean up resources. */
  destroy(): void;
}

/** Options for creating a VoiceManager. */
export interface VoiceManagerOptions {
  adapter: VoiceAdapter;
  events?: VoiceEvents;
  /** Override locale string (default: navigator.language). */
  locale?: string;
}

/** Controller returned by voiceManager(). */
export interface VoiceManagerController {
  /** Start listening. */
  start(): void;
  /** Stop listening. */
  stop(): void;
  /** Toggle between listening and idle. */
  toggle(): void;
  /** Get current state. */
  getState(): VoiceState;
  /** Swap adapter at runtime. */
  setAdapter(adapter: VoiceAdapter): void;
  /** Clean up everything. */
  destroy(): void;
}

/**
 * Create a voice manager that wires an adapter to UI events.
 * Manages the idle -> listening -> processing -> idle state cycle,
 * with automatic error recovery.
 */
export function voiceManager(opts: VoiceManagerOptions): VoiceManagerController {
  let adapter = opts.adapter;
  const events = opts.events;
  let state: VoiceState = 'idle';
  let recoveryTimer: ReturnType<typeof setTimeout> | null = null;

  function getLocaleString(): string {
    if (opts.locale) return opts.locale;
    if (typeof navigator !== 'undefined' && navigator.language) {
      return navigator.language;
    }
    return 'en-US';
  }

  function setState(next: VoiceState): void {
    state = next;
    if (events && typeof events.onStateChange === 'function') {
      events.onStateChange(next);
    }
  }

  function clearRecoveryTimer(): void {
    if (recoveryTimer !== null) {
      clearTimeout(recoveryTimer);
      recoveryTimer = null;
    }
  }

  function transitionToError(error: Error): void {
    setState('error');
    if (events && typeof events.onError === 'function') {
      events.onError(error);
    }
    clearRecoveryTimer();
    recoveryTimer = setTimeout(function () {
      recoveryTimer = null;
      setState('idle');
    }, 3000);
  }

  function start(): void {
    if (state === 'listening' || state === 'processing') return;

    if (!adapter.isSupported()) {
      var msg = 'VoiceManager: adapter "' + adapter.name + '" is not supported in this environment';
      console.warn(msg);
      transitionToError(new Error(msg));
      return;
    }

    clearRecoveryTimer();
    setState('listening');
    adapter.start({
      locale: getLocaleString(),
      continuous: true,
      interimResults: true,
    });
  }

  function stop(): void {
    if (state === 'idle') return;

    clearRecoveryTimer();
    var wasListening = state === 'listening';
    adapter.stop();
    if (wasListening) {
      setState('processing');
      setState('idle');
    } else {
      setState('idle');
    }
  }

  function toggle(): void {
    if (state === 'idle') {
      start();
    } else {
      stop();
    }
  }

  function getState(): VoiceState {
    return state;
  }

  function setAdapter(next: VoiceAdapter): void {
    if (state === 'listening' || state === 'processing') {
      adapter.stop();
      setState('idle');
    }
    adapter.destroy();
    adapter = next;
  }

  function destroy(): void {
    if (state === 'listening' || state === 'processing') {
      adapter.stop();
    }
    clearRecoveryTimer();
    adapter.destroy();
    state = 'idle';
  }

  return {
    start: start,
    stop: stop,
    toggle: toggle,
    getState: getState,
    setAdapter: setAdapter,
    destroy: destroy,
  };
}

export { createRealtimeAdapter } from './voice-input-realtime';
export type { RealtimeAdapterOptions } from './voice-input-realtime';

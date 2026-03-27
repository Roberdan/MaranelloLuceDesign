/**
 * Maranello Luce Design - GPT Realtime API voice adapter.
 * Reference implementation of VoiceAdapter for OpenAI's Realtime API
 * via WebSocket. Zero runtime dependencies — WebSocket is browser-native.
 */
import type { VoiceAdapter, VoiceStartConfig, VoiceEvents } from './voice-input';

/** Options for the GPT Realtime adapter. */
export interface RealtimeAdapterOptions {
  /** Consumer provides API key. */
  apiKey?: string;
  /** Model ID (default: 'gpt-4o-realtime-preview'). */
  model?: string;
  /** Custom WebSocket URL (default: wss://api.openai.com/v1/realtime). */
  wsUrl?: string;
  /** Event callbacks. */
  events?: VoiceEvents;
}

const DEFAULT_WS_URL = 'wss://api.openai.com/v1/realtime';
const DEFAULT_MODEL = 'gpt-4o-realtime-preview';

/**
 * Parse a server event from the Realtime API.
 * Returns null for unrecognised or malformed messages.
 */
function parseServerEvent(raw: string): Record<string, unknown> | null {
  try {
    var parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object' && typeof parsed.type === 'string') {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch (_e) {
    return null;
  }
}

/**
 * Build the full WebSocket URL with model query parameter.
 */
function buildWsUrl(base: string, model: string): string {
  var sep = base.indexOf('?') === -1 ? '?' : '&';
  return base + sep + 'model=' + encodeURIComponent(model);
}

/**
 * Create a GPT Realtime API voice adapter (reference implementation).
 * Connects to the OpenAI Realtime API via WebSocket and streams
 * transcript events back through VoiceEvents callbacks.
 */
export function createRealtimeAdapter(opts: RealtimeAdapterOptions): VoiceAdapter {
  var ws: WebSocket | null = null;
  var events = opts.events || null;
  var apiKey = opts.apiKey || '';
  var model = opts.model || DEFAULT_MODEL;
  var wsUrl = opts.wsUrl || DEFAULT_WS_URL;
  var intentionalClose = false;

  function sendJson(data: Record<string, unknown>): void {
    if (ws && ws.readyState === 1) {
      ws.send(JSON.stringify(data));
    }
  }

  function handleMessage(raw: string): void {
    var evt = parseServerEvent(raw);
    if (!evt) return;

    var type = evt.type as string;

    if (type === 'response.audio_transcript.delta') {
      var delta = (evt.delta as string) || '';
      if (events && typeof events.onTranscript === 'function') {
        events.onTranscript(delta, false);
      }
    } else if (type === 'response.audio_transcript.done') {
      var transcript = (evt.transcript as string) || '';
      if (events && typeof events.onTranscript === 'function') {
        events.onTranscript(transcript, true);
      }
    } else if (type === 'error') {
      var errObj = evt.error as Record<string, unknown> | undefined;
      var errMsg = (errObj && typeof errObj.message === 'string')
        ? errObj.message
        : 'Unknown realtime error';
      if (events && typeof events.onError === 'function') {
        events.onError(new Error(errMsg));
      }
    }
  }

  function closeWebSocket(): void {
    if (ws) {
      intentionalClose = true;
      ws.onopen = null;
      ws.onmessage = null;
      ws.onerror = null;
      ws.onclose = null;
      if (ws.readyState === 0 || ws.readyState === 1) {
        ws.close();
      }
      ws = null;
    }
  }

  var adapter: VoiceAdapter = {
    name: 'gpt-realtime',

    start: function start(config: VoiceStartConfig): void {
      closeWebSocket();
      intentionalClose = false;

      var url = buildWsUrl(wsUrl, model);
      var protocols = apiKey
        ? ['realtime', 'openai-insecure-api-key.' + apiKey, 'openai-beta.realtime-v1']
        : ['realtime', 'openai-beta.realtime-v1'];

      ws = new WebSocket(url, protocols);

      ws.onopen = function (): void {
        sendJson({
          type: 'session.update',
          session: {
            modalities: ['text', 'audio'],
            input_audio_transcription: { model: 'whisper-1' },
            turn_detection: { type: 'server_vad' },
            instructions: 'Locale: ' + (config.locale || 'en-US'),
          },
        });
      };

      ws.onmessage = function (ev: MessageEvent): void {
        if (typeof ev.data === 'string') {
          handleMessage(ev.data);
        }
      };

      ws.onerror = function (): void {
        if (events && typeof events.onError === 'function') {
          events.onError(new Error('WebSocket connection error'));
        }
        if (events && typeof events.onStateChange === 'function') {
          events.onStateChange('error');
        }
      };

      ws.onclose = function (): void {
        if (intentionalClose) return;
        if (events && typeof events.onStateChange === 'function') {
          events.onStateChange('error');
        }
      };
    },

    stop: function stop(): void {
      closeWebSocket();
    },

    isSupported: function isSupported(): boolean {
      return typeof WebSocket !== 'undefined';
    },

    destroy: function destroy(): void {
      closeWebSocket();
    },
  };

  return adapter;
}

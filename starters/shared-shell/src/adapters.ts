/**
 * Provider-neutral runtime adapters for the shared shell starter.
 *
 * Each adapter is a typed contract that application teams implement
 * to plug in real services without rewriting the shell. The shell
 * never imports concrete providers — only these interfaces.
 */

// ---------------------------------------------------------------------------
// AI adapter — Vercel AI SDK canonical route + streaming surface
// ---------------------------------------------------------------------------

/** A single structured action an agent can perform. */
export interface AgentAction {
  id: string;
  label: string;
  description?: string;
}

/** Server-side AI route contract (e.g., Vercel AI SDK useChat). */
export interface AIAdapter {
  /** API route path for chat/completions (default: /api/ai/chat). */
  routePath: string;
  /** Model identifier passed to the provider (e.g., claude-sonnet-4-6). */
  model: string;
  /** Structured actions the agent can invoke in this shell context. */
  actions?: AgentAction[];
  /** System prompt prepended to every conversation in this shell. */
  systemPrompt?: string;
}

// ---------------------------------------------------------------------------
// Auth adapter — provider-neutral session contract
// ---------------------------------------------------------------------------

/** Minimal session shape returned by the auth adapter. */
export interface AuthSession {
  userId: string;
  email?: string;
  name?: string;
  avatarUrl?: string;
  expiresAt?: string;
}

/** Auth adapter contract (NextAuth, Clerk, Auth0, custom). */
export interface AuthAdapter {
  /** Provider identifier for config routing (e.g., 'nextauth', 'clerk'). */
  provider: string;
  /** Path to the sign-in page/route. */
  signInPath: string;
  /** Path to the sign-out action. */
  signOutPath: string;
  /** API route that returns the current AuthSession or null. */
  sessionEndpoint: string;
}

// ---------------------------------------------------------------------------
// RBAC adapter — role-based access for nav items and actions
// ---------------------------------------------------------------------------

/** A named permission that gates a nav item or action. */
export interface Permission {
  id: string;
  description?: string;
}

/** RBAC adapter: maps roles to permissions and evaluates access. */
export interface RBACAdapter {
  /** Known roles in this application (e.g., ['viewer','editor','admin']). */
  roles: string[];
  /** Map of role to granted permission ids. */
  grants: Record<string, string[]>;
  /** Default role assigned when none is resolved. */
  defaultRole: string;
}

/** Check whether a role has a specific permission. */
export function hasPermission(
  adapter: RBACAdapter,
  role: string,
  permissionId: string,
): boolean {
  const perms = adapter.grants[role];
  return Array.isArray(perms) && perms.includes(permissionId);
}

// ---------------------------------------------------------------------------
// Telemetry adapter — analytics and observability contract
// ---------------------------------------------------------------------------

/** A telemetry event emitted by the shell runtime. */
export interface TelemetryEvent {
  name: string;
  properties?: Record<string, string | number | boolean>;
  timestamp?: string;
}

/** Telemetry adapter contract (PostHog, Segment, OpenTelemetry, custom). */
export interface TelemetryAdapter {
  /** Provider identifier (e.g., 'posthog', 'segment', 'otel'). */
  provider: string;
  /** Client-side script URL or SDK entry point. */
  scriptSrc?: string;
  /** API key / write key (injected at build time, never hardcoded). */
  envKey: string;
  /** Events the shell emits automatically. */
  autoEvents: string[];
}

// ---------------------------------------------------------------------------
// API adapter — backend data access contract
// ---------------------------------------------------------------------------

/** A single API endpoint the shell can call. */
export interface APIEndpoint {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  description?: string;
}

/** API adapter: base URL + typed endpoint catalog. */
export interface APIAdapter {
  /** Base URL for all API calls (injected via env var at runtime). */
  baseUrlEnv: string;
  /** Typed endpoint catalog for this shell context. */
  endpoints: APIEndpoint[];
  /** Default request headers (e.g., Accept, Content-Type). */
  defaultHeaders?: Record<string, string>;
}

// ---------------------------------------------------------------------------
// Feature flag adapter — runtime feature toggles
// ---------------------------------------------------------------------------

/** Feature flag adapter contract (LaunchDarkly, Unleash, env-based). */
export interface FeatureFlagAdapter {
  /** Provider identifier (e.g., 'launchdarkly', 'env'). */
  provider: string;
  /** Known flags with default values. */
  defaults: Record<string, boolean>;
}

// ---------------------------------------------------------------------------
// Composite adapter config — all adapters in one typed bundle
// ---------------------------------------------------------------------------

/** Complete adapter configuration for a shared shell instance. */
export interface SharedShellAdapters {
  ai?: AIAdapter;
  auth?: AuthAdapter;
  rbac?: RBACAdapter;
  telemetry?: TelemetryAdapter;
  api?: APIAdapter;
  featureFlags?: FeatureFlagAdapter;
}

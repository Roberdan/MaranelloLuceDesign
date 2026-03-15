/**
 * Maranello Luce Design - Login screen component
 * Generic SSO login screen with system health display.
 */
import type { LoginServiceCheck } from './login-dom';
export type { LoginServiceCheck } from './login-dom';
export interface LoginHealthData {
    checks?: LoginServiceCheck[];
    error?: string | null;
}
export interface LoginScreenOptions {
    subtitle?: string;
    version?: string;
    env?: string;
    error?: string | null;
    checks?: LoginServiceCheck[] | null;
    onLogin?: (event: MouseEvent) => void;
    healthUrl?: string;
    autoHealth?: boolean;
    pollInterval?: number;
    /** Label for the login button (default: "Sign in with SSO") */
    buttonLabel?: string;
    /** Application title (default: "Maranello") */
    appTitle?: string;
    /** Title accent text (default: "Luce") */
    appTitleAccent?: string;
    /** Whether to show the system status section (default: true) */
    showStatus?: boolean;
}
export interface LoginScreenController {
    updateStatus: (healthData: LoginHealthData | null | undefined) => void;
    setError: (msg: string | null) => void;
    destroy: () => void;
}
/**
 * Create a login screen with optional system health polling.
 */
export declare function loginScreen(container: string | HTMLElement, opts?: LoginScreenOptions): LoginScreenController | null;

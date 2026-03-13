/**
 * Maranello Luce Design - IIFE namespace bootstrap
 * Provides backward compatibility with window.Maranello for legacy consumers.
 * W3/W4 module registrations are in maranello-exports.ts.
 */
declare global {
    interface Window {
        Maranello: Record<string, unknown>;
    }
}
declare const M: Record<string, unknown>;
export { M as Maranello };

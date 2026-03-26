declare global {
    interface Window {
        Maranello: Record<string, unknown>;
    }
}
declare const M: Record<string, unknown>;
export { M as Maranello };

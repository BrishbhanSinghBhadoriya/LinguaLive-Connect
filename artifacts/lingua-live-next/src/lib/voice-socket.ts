/**
 * Lightweight WebSocket wrapper for voice translation rooms.
 * No external dependencies — uses native browser WebSocket.
 *
 * Protocol (JSON):
 *  Client → Server:  { type, roomId?, userId?, userName?, ...data }
 *  Server → Client:  { type, ...data }
 */

export type VoiceSocketEvent =
  | { type: "connected" }
  | { type: "disconnected" }
  | { type: "user-joined";  userId: string; userName: string; count: number }
  | { type: "user-left";    userName: string; count: number }
  | { type: "receive-transcript"; id: string; userId: string; userName: string;
      original: string; translated: string; fromLang: string; toLang: string; timestamp: string }
  | { type: "error"; message: string };

type Listener = (event: VoiceSocketEvent) => void;

const MAX_RETRIES   = 5;
const RETRY_BASE_MS = 2_000;

export class VoiceSocket {
  private ws: WebSocket | null = null;
  private listeners: Listener[] = [];
  private pingInterval: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private retryCount  = 0;
  private destroyed   = false;
  private readonly url: string;
  private readonly auth: { userId: string; userName: string };

  constructor(serverUrl: string, auth: { userId: string; userName: string }) {
    this.url  = serverUrl.replace(/^https?/, "ws") + "/ws-voice";
    this.auth = auth;
  }

  connect() {
    if (this.destroyed) return;
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) return;

    try {
      this.ws = new WebSocket(this.url);
    } catch {
      this.emit({ type: "error", message: "WebSocket not supported in this browser" });
      return;
    }

    this.ws.onopen = () => {
      if (this.destroyed) { this.ws?.close(); return; }
      this.retryCount = 0;
      this.emit({ type: "connected" });
      this.pingInterval = setInterval(() => this.send({ type: "ping" }), 25_000);
    };

    this.ws.onclose = (ev) => {
      this.clearPing();
      if (this.destroyed) return;
      this.emit({ type: "disconnected" });

      // Don't retry if closed cleanly (code 1000) or too many attempts
      if (ev.code === 1000 || this.retryCount >= MAX_RETRIES) {
        if (this.retryCount >= MAX_RETRIES) {
          this.emit({ type: "error", message: `Cannot reach voice server at ${this.url}. Is the API server running on port 3001?` });
        }
        return;
      }
      const delay = RETRY_BASE_MS * Math.pow(1.5, this.retryCount++);
      this.reconnectTimer = setTimeout(() => this.connect(), delay);
    };

    this.ws.onerror = () => {
      // onclose fires right after, so we don't emit here to avoid duplicate errors
    };

    this.ws.onmessage = (ev) => {
      try {
        const data = JSON.parse(ev.data as string) as VoiceSocketEvent;
        this.emit(data);
      } catch {}
    };
  }

  send(data: Record<string, unknown>) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(data));
    }
  }

  joinRoom(roomId: string) {
    this.send({ type: "join-room", roomId, ...this.auth });
  }

  leaveRoom(roomId: string) {
    this.send({ type: "leave-room", roomId, ...this.auth });
  }

  sendTranscript(roomId: string, transcript: Record<string, unknown>) {
    this.send({ type: "send-transcript", roomId, ...transcript });
  }

  on(listener: Listener) {
    this.listeners.push(listener);
    return () => { this.listeners = this.listeners.filter(l => l !== listener); };
  }

  disconnect() {
    this.destroyed = true;
    this.clearPing();
    if (this.reconnectTimer) { clearTimeout(this.reconnectTimer); this.reconnectTimer = null; }
    if (this.ws) {
      this.ws.onclose = null; // prevent onclose from firing after intentional disconnect
      this.ws.close(1000, "client disconnect");
      this.ws = null;
    }
  }

  get isConnected() {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private emit(event: VoiceSocketEvent) {
    this.listeners.forEach(l => l(event));
  }

  private clearPing() {
    if (this.pingInterval) { clearInterval(this.pingInterval); this.pingInterval = null; }
  }
}

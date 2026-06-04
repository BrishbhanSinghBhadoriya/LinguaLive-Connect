/**
 * Raw WebSocket handler for voice translation rooms.
 * Mounted on the same HTTP server as Express + Socket.io.
 * Path: /ws-voice
 */
import { WebSocketServer, WebSocket } from "ws";
import type { IncomingMessage } from "http";
import type { Server as HttpServer } from "http";
import { logger } from "./lib/logger.js";

type Client = {
  ws: WebSocket;
  userId: string;
  userName: string;
  roomId: string | null;
};

const clients = new Map<WebSocket, Client>();
// roomId → Set of WebSocket connections
const rooms = new Map<string, Set<WebSocket>>();

function getRoomCount(roomId: string) {
  return rooms.get(roomId)?.size ?? 0;
}

function broadcast(roomId: string, data: unknown, exclude?: WebSocket) {
  const room = rooms.get(roomId);
  if (!room) return;
  const msg = JSON.stringify(data);
  for (const ws of room) {
    if (ws !== exclude && ws.readyState === WebSocket.OPEN) {
      ws.send(msg);
    }
  }
}

function send(ws: WebSocket, data: unknown) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(data));
  }
}

export function attachWsVoice(server: HttpServer) {
  const wss = new WebSocketServer({ server, path: "/ws-voice" });

  wss.on("connection", (ws: WebSocket, _req: IncomingMessage) => {
    const client: Client = { ws, userId: "", userName: "User", roomId: null };
    clients.set(ws, client);

    ws.on("message", (raw) => {
      let msg: Record<string, string>;
      try { msg = JSON.parse(raw.toString()); } catch { return; }

      const { type, roomId, userId, userName, ...rest } = msg;

      // Update identity on first meaningful message
      if (userId)   client.userId   = userId;
      if (userName) client.userName = userName;

      switch (type) {
        case "ping":
          send(ws, { type: "pong" });
          break;

        case "join-room": {
          if (!roomId) break;
          // Leave previous room if any
          if (client.roomId && client.roomId !== roomId) {
            leaveRoom(ws, client);
          }
          client.roomId = roomId;
          if (!rooms.has(roomId)) rooms.set(roomId, new Set());
          rooms.get(roomId)!.add(ws);
          const count = getRoomCount(roomId);
          logger.info(`${client.userName} joined room ${roomId} (${count})`);
          broadcast(roomId, { type: "user-joined", userId: client.userId, userName: client.userName, count }, ws);
          break;
        }

        case "leave-room": {
          leaveRoom(ws, client);
          break;
        }

        case "send-transcript": {
          if (!client.roomId) break;
          broadcast(client.roomId, { type: "receive-transcript", ...rest, userId: client.userId, userName: client.userName }, ws);
          break;
        }
      }
    });

    ws.on("close", () => {
      leaveRoom(ws, client);
      clients.delete(ws);
    });

    ws.on("error", (err) => {
      logger.error({ err }, "WS error");
    });
  });

  logger.info("WebSocket voice server attached at /ws-voice");
  return wss;
}

function leaveRoom(ws: WebSocket, client: Client) {
  if (!client.roomId) return;
  const room = rooms.get(client.roomId);
  if (room) {
    room.delete(ws);
    if (room.size === 0) rooms.delete(client.roomId);
    else broadcast(client.roomId, { type: "user-left", userName: client.userName, count: room.size });
  }
  logger.info(`${client.userName} left room ${client.roomId}`);
  client.roomId = null;
}

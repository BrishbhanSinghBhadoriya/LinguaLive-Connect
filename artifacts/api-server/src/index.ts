import { createServer } from "http";
import app from "./app";
import { attachWsVoice } from "./ws-voice.js";
import { logger } from "./lib/logger";

const rawPort = process.env["PORT"];
if (!rawPort) throw new Error("PORT environment variable is required.");
const port = Number(rawPort);
if (Number.isNaN(port) || port <= 0) throw new Error(`Invalid PORT: "${rawPort}"`);

const httpServer = createServer(app);

// Attach WebSocket handler before listen so the 'upgrade' listener is
// registered before any client can send an HTTP upgrade request.
attachWsVoice(httpServer);

httpServer.listen(port, () => {
  logger.info({ port }, "LinguaLive API + WebSocket voice server running");
});

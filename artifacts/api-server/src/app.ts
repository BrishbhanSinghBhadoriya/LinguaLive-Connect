import "dotenv/config";
import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";
import connectDB from "./config/database";

const app: Express = express();

// Connect to MongoDB
connectDB();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    // Set ALLOWED_ORIGINS as comma-separated list in Railway env vars
    // e.g. https://lingua-live.vercel.app,https://yourdomain.com
    ? (process.env.ALLOWED_ORIGINS ?? "").split(",").map(o => o.trim()).filter(Boolean)
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use("/api", router);

export default app;

import "dotenv/config";
import express, { Application, Request, Response } from "express";
import http from "http";
import { matchRouter } from "./routes/matches";
import { attachWebSocketServer } from "./ws/server";

const PORT = Number(process.env.PORT || 5000);
const HOST = process.env.HOST || "0.0.0.0";

const app: Application = express();
const server = http.createServer(app);

app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ message: "Server is healthy" });
});

app.use("/api/matches", matchRouter);

const { broadcastMatchCreated } = attachWebSocketServer(server);

app.locals.broadcastMatchCreated = broadcastMatchCreated;

server.listen(PORT, HOST, () => {
  const baseUrl =
    HOST === "0.0.0.0" ? `http://localhost:${PORT}` : `http://${HOST}:${PORT}`;
  console.log(`Server running at ${baseUrl}`);
  console.log(
    `Websocket Server running at ${baseUrl.replace("http", "ws")}/ws`,
  );
});

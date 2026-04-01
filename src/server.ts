import express, { Application, Request, Response } from "express";

const app: Application = express();
const PORT = 5000;

app.use(express.json());

app.get("/api/health", (_req: Request, res: Response) => {
  res.json({ message: "Server is healthy" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
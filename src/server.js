import express from "express";

const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ message: "Server is healthy" });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


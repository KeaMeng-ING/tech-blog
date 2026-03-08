import "dotenv/config";
import express from "express";
import cors from "cors";
import type { Request, Response } from "express";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

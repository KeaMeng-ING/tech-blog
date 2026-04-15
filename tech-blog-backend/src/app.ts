import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import postRouter from "./routes/post.routes.js";
import categoryRouter from "./routes/category.routes.js";
import userRouter from "./routes/user.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import githubRouter from "./routes/github.routes.js";
import newsRouter from "./routes/newsletter.routes.js";

const app = express();
const port = process.env.PORT || 5000;

//app.use(cors());
app.use(cors({
  origin: "http://localhost:3001",
  credentials: true
}));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/users", userRouter);
app.use("/api/subscription", subscriptionRouter);
app.use("/api/github", githubRouter);
app.use("/api/admin", newsRouter);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});

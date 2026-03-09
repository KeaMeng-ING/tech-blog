import { Router } from "express";
import { getTrendingRepos } from "../services/github.service.js";
import { success, error } from "../utils/response.utils.js";

const githubRouter = Router();

githubRouter.get("/trending", async (req, res) => {
  try {
    const repos = await getTrendingRepos();
    success(res, repos);
  } catch (e) {
    error(res, "Failed to fetch trending repos" + e, 500);
  }
});

export default githubRouter;

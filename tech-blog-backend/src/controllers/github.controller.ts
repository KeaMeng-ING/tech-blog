import { Request, Response } from "express";
import { getTrendingRepos } from "../services/github.service";
import { success, error } from "../utils/response.utils";

export const getTrending = async (_: Request, res: Response) => {
  try {
    const repos = await getTrendingRepos();
    success(res, repos);
  } catch (err) {
    error(res, "Failed to fetch GitHub repos", 500);
  }
};

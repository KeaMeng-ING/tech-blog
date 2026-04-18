import express from "express"
import { getNews, getSearchNews, getSingleNews } from "../controllers/newsAutomation.controller.js"

const newsAutomationRouter = express.Router()

newsAutomationRouter.get("/", getNews)
newsAutomationRouter.get("/search", getSearchNews)
newsAutomationRouter.get("/:id", getSingleNews)

export default newsAutomationRouter;
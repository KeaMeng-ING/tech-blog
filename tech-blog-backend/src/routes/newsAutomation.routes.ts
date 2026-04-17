import express from "express"
import { getNews, getSingleNews } from "../controllers/newsAutomation.controller.js"

const newsAutomationRouter = express.Router()

newsAutomationRouter.get("/", getNews)
newsAutomationRouter.get("/:id", getSingleNews)

export default newsAutomationRouter;
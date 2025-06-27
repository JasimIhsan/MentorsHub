import { Router } from "express";
import { getAllListedGamificationTasksController } from "../../controllers/user/composer";

export const gamificationRoute = Router();

gamificationRoute.get("/listed/:userId", (req, res, next) => getAllListedGamificationTasksController.handle(req, res, next));

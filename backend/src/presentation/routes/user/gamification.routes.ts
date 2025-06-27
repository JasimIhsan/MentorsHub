import { Router } from "express";
import { getAllListedGamificationTasksController, getUserProgressController } from "../../controllers/user/composer";

export const gamificationRoute = Router();

gamificationRoute.get("/listed/:userId", (req, res, next) => getAllListedGamificationTasksController.handle(req, res, next));

gamificationRoute.get("/progress/:userId", (req, res, next) => getUserProgressController.handle(req, res, next));

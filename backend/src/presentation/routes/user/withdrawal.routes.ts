import { Router } from "express";
import { requestWithdrawalController } from "../../controllers/withdrawal/composer";

export const withdrawalRouter = Router();

withdrawalRouter.post("/create/:userId", (req, res, next) => requestWithdrawalController.handle(req, res, next));

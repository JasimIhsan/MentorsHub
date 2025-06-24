import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { createTransactionController, getTransactionsController, getWalletController, topupWalletController, withdrawWalletController } from "../../controllers/wallet/composer";

export const adminWalletRouter = Router();

adminWalletRouter.get("/:userId", verifyAccessToken, requireRole("admin"), (req, res, next) => getWalletController.handle(req, res, next));

adminWalletRouter.post("/top-up/:userId", verifyAccessToken, requireRole("admin"), (req, res, next) => topupWalletController.handle(req, res, next));

adminWalletRouter.get("/transactions/:userId", verifyAccessToken, requireRole("admin"), (req, res, next) => getTransactionsController.handle(req, res, next));

adminWalletRouter.post("/create-transaction", verifyAccessToken, requireRole("admin"), (req, res, next) => createTransactionController.handle(req, res, next));

adminWalletRouter.post("/withdraw/:userId", verifyAccessToken, requireRole("admin"), (req, res, next) => withdrawWalletController.handle(req, res, next));
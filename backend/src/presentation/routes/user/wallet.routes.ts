import { Router } from "express";
import { createTransactionController, createWalletController, createWithdrawalRequestController, getTransactionsController, getWalletController, topupWalletController, withdrawWalletController } from "../../controllers/wallet/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
export const userWalletRouter = Router();

userWalletRouter.post("/create", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => createWalletController.handle(req, res, next));

userWalletRouter.get("/transactions/:userId", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => getTransactionsController.handle(req, res, next));

userWalletRouter.post("/create-transaction", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => createTransactionController.handle(req, res, next));

userWalletRouter.post("/create-withdrawal-request", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => createWithdrawalRequestController.handle(req, res, next));

userWalletRouter.get("/:userId", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => getWalletController.handle(req, res, next));

userWalletRouter.post("/top-up/:userId", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => topupWalletController.handle(req, res, next));

userWalletRouter.post("/withdraw/:userId", verifyAccessToken, requireRole("user", "mentor"), (req, res, next) => withdrawWalletController.handle(req, res, next));
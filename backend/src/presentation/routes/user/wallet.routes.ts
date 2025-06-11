import { Router } from "express";
import { createTransactionController, createWalletController, createWithdrawalRequestController, getTransactionsController, getWalletController, topupWalletController } from "../../controllers/wallet/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
export const userWalletRouter = Router();

userWalletRouter.post("/create", verifyAccessToken, requireRole("user", "mentor"), (req, res) => createWalletController.handle(req, res));

userWalletRouter.get("/transactions/:userId", verifyAccessToken, requireRole("user", "mentor"), (req, res) => getTransactionsController.handle(req, res));

userWalletRouter.post("/create-transaction", verifyAccessToken, requireRole("user", "mentor"), (req, res) => createTransactionController.handle(req, res));

userWalletRouter.post("/create-withdrawal-request", verifyAccessToken, requireRole("user", "mentor"), (req, res) => createWithdrawalRequestController.handle(req, res));

userWalletRouter.get("/:userId", verifyAccessToken, requireRole("user", "mentor"), (req, res) => getWalletController.handle(req, res));

userWalletRouter.post('/top-up/:userId', verifyAccessToken, requireRole("user", "mentor"), (req, res) => topupWalletController.handle(req, res));
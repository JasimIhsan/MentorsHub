import { Router } from "express";
import { createTransactionController, createWalletController, createWithdrawalRequestController, getTransactionsController } from "../../controllers/wallet/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
export const userWalletRouter = Router();

userWalletRouter.post("/create", verifyAccessToken, requireRole("user"), (req, res) => createWalletController.handle(req, res));

userWalletRouter.get("/transactions/:userId", verifyAccessToken, requireRole("user"), (req, res) => getTransactionsController.handle(req, res));

userWalletRouter.post("/create-transaction", verifyAccessToken, requireRole("user"), (req, res) => createTransactionController.handle(req, res));

userWalletRouter.post("/create-withdrawal-request", verifyAccessToken, requireRole("user"), (req, res) => createWithdrawalRequestController.handle(req, res));

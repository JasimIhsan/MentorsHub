import { Router } from "express";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { createTransactionController, getTransactionsController, getWalletController, topupWalletController, withdrawWalletController } from "../../controllers/wallet/composer";

export const adminWalletRouter = Router();

adminWalletRouter.get("/:userId", verifyAccessToken, requireRole("admin"), (req, res) => getWalletController.handle(req, res));

adminWalletRouter.post("/top-up/:userId", verifyAccessToken, requireRole("admin"), (req, res) => topupWalletController.handle(req, res));

adminWalletRouter.get("/transactions/:userId", verifyAccessToken, requireRole("admin"), (req, res) => getTransactionsController.handle(req, res));

adminWalletRouter.post("/create-transaction", verifyAccessToken, requireRole("admin"), (req, res) => createTransactionController.handle(req, res));

adminWalletRouter.post("/withdraw/:userId", verifyAccessToken, requireRole("admin"), (req, res) => withdrawWalletController.handle(req, res));
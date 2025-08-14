import { Router } from "express";
import { requestWithdrawalController } from "../../controllers/withdrawal/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const withdrawalRouter = Router();

withdrawalRouter.post("/create/:userId", verifyAccessToken, requireRole(RoleEnum.USER, RoleEnum.MENTOR), (req, res, next) => requestWithdrawalController.handle(req, res, next));

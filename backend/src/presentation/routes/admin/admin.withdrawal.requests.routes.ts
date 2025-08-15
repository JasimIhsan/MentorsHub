import { Router } from "express";
import { approveWithdrawalRequestController, getWithdrawalRequestsController, rejectWithdrawalRequestController, withdrawPaymentCreateOrderController } from "../../controllers/admin/composer";
import { verifyAccessToken } from "../../middlewares/auth.access.token.middleware";
import { requireRole } from "../../middlewares/require.role.middleware";
import { RoleEnum } from "../../../application/interfaces/enums/role.enum";

export const adminWithdrawalRequestsRouter = Router();

adminWithdrawalRequestsRouter.get("/requests", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => getWithdrawalRequestsController.handle(req, res, next));

adminWithdrawalRequestsRouter.get("/payment/order/:requestId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => withdrawPaymentCreateOrderController().handle(req, res, next));

adminWithdrawalRequestsRouter.post("/approve/:requestId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => approveWithdrawalRequestController.handle(req, res, next));

adminWithdrawalRequestsRouter.put("/reject/:requestId", verifyAccessToken, requireRole(RoleEnum.ADMIN), (req, res, next) => rejectWithdrawalRequestController.handle(req, res, next));

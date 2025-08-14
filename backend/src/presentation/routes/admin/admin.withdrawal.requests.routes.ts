import { Router } from "express";
import { approveWithdrawalRequestController, getWithdrawalRequestsController, withdrawPaymentCreateOrderController } from "../../controllers/admin/composer";

export const adminWithdrawalRequestsRouter = Router();

adminWithdrawalRequestsRouter.get("/requests", (req, res, next) => getWithdrawalRequestsController.handle(req, res, next));

adminWithdrawalRequestsRouter.get("/payment/order/:requestId", (req, res, next) => withdrawPaymentCreateOrderController().handle(req, res, next));

adminWithdrawalRequestsRouter.post("/approve/:requestId", (req, res, next) => approveWithdrawalRequestController.handle(req, res, next));

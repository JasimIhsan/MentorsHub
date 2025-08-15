import { refundRepository, sessionRepository, walletRepository } from "../../../infrastructure/composer";
import { notifyUserUseCase } from "../notification/composer";
import { MentorCancelSessionRefundUseCase } from "./mentor.cancel.session.refund.usecase";
import { UserCancelSessionRefundUseCase } from "./user.cancel.session.refund.usecase";

export const userCancelSessionRefundUseCase = new UserCancelSessionRefundUseCase(sessionRepository, walletRepository, notifyUserUseCase, refundRepository);
export const mentorCancelSessionRefundUseCase = new MentorCancelSessionRefundUseCase(sessionRepository, walletRepository, notifyUserUseCase, refundRepository);

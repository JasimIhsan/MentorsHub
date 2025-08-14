import { getPaymentGatewayService, userRepository, walletRepository, withdrawalRequestRepository } from "../../../../infrastructure/composer";
import { notifyUserUseCase } from "../../notification/composer";
import { ApproveWithdrawalRequestUseCase } from "./approve.withdrawal.request.usecase";
import { GetWithdrawalRequestsUseCase } from "./get.withdrawal.requests.usecase";
import { WithdrawPaymentCreateOrderUseCase } from "./request.payment.create.order.usecase";

export const getWithdrawalRequestsUseCase = new GetWithdrawalRequestsUseCase(withdrawalRequestRepository, userRepository);
export const approveWithdrawalRequestUseCase = new ApproveWithdrawalRequestUseCase(withdrawalRequestRepository, walletRepository, notifyUserUseCase, userRepository);

// lazy loading usecases
export const withdrawPaymentCreateOrderUseCase = () => new WithdrawPaymentCreateOrderUseCase(getPaymentGatewayService(), withdrawalRequestRepository);

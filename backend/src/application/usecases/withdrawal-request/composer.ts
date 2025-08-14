import { userRepository, walletRepository, withdrawalRequestRepository } from "../../../infrastructure/composer";
import { RequestWithdrawalUseCase } from "./request.withdrawal.usecase";

export const requestWithdrawalUseCase = new RequestWithdrawalUseCase(withdrawalRequestRepository, walletRepository, userRepository);

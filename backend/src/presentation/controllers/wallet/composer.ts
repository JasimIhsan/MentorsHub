import { createTransactionUsecase, createWalletUsecase, createWithdrawalRequestUseCase, getTransactionsUsecase, getWithdrawalRequestsUsecase, updateWalletBalanceUseCase } from "../../../application/usecases/wallet/composer";
import { CreateTransactionController } from "./create.transaction.controller";
import { CreateWalletController } from "./create.wallet.controller";
import { CreateWithdrawalRequestController } from "./create.withdrawal.request.controller";
import { GetTransactionsController } from "./get.transactions.controller";
import { GetWithdrawalRequestsController } from "./get.withdrawal.requests.controller";
import { UpdateWalletBalanceController } from "./update.wallet.balance.controller";

export const createWalletController = new CreateWalletController(createWalletUsecase);
export const createTransactionController = new CreateTransactionController(createTransactionUsecase);
export const createWithdrawalRequestController = new CreateWithdrawalRequestController(createWithdrawalRequestUseCase);
export const updateWalletBalanceController = new UpdateWalletBalanceController(updateWalletBalanceUseCase);
export const getTransactionsController = new GetTransactionsController(getTransactionsUsecase);
export const getWithdrawalRequestsController = new GetWithdrawalRequestsController(getWithdrawalRequestsUsecase);
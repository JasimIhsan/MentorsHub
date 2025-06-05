import { walletRepository } from "../../../infrastructure/composer";
import { CreateTransactionUseCase } from "./create.transaction.usecase";
import { CreateWalletUseCase } from "./create.wallet.usecase";
import { CreateWithdrawalRequestUseCase } from "./create.withdrawel.usecase";
import { GetTransactionsUseCase } from "./get.transactions.usecase";
import { GetWithdrawalRequestsUseCase } from "./get.withdrawel.requests.usecase";
import { UpdateWalletBalanceUseCase } from "./update.wallet.balance.usecase";

export const createWalletUsecase = new CreateWalletUseCase(walletRepository);
export const createTransactionUsecase = new CreateTransactionUseCase(walletRepository);
export const createWithdrawalRequestUseCase = new CreateWithdrawalRequestUseCase(walletRepository);
export const getTransactionsUsecase = new GetTransactionsUseCase(walletRepository);
export const getWithdrawalRequestsUsecase = new GetWithdrawalRequestsUseCase(walletRepository);
export const updateWalletBalanceUseCase = new UpdateWalletBalanceUseCase(walletRepository);

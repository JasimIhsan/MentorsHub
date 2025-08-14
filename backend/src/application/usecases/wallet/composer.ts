import { adminRepository, sessionRepository, userRepository, walletRepository } from "../../../infrastructure/composer";
import { notifyUserUseCase } from "../notification/composer";
import { CreateTransactionUseCase } from "./create.transaction.usecase";
import { CreateWalletUseCase } from "./create.wallet.usecase";
import { GetTransactionsUseCase } from "./get.transactions.usecase";
import { GetWalletUsecase } from "./get.wallet.usecase";
import { UpdateWalletBalanceUseCase } from "./update.wallet.balance.usecase";
import { WalletTopUpUseCase } from "./wallet.topup.usecase";
import { WithdrawWalletUseCase } from "./withdraw.wallet.usecase";

export const createWalletUsecase = new CreateWalletUseCase(walletRepository);
export const createTransactionUsecase = new CreateTransactionUseCase(walletRepository, userRepository, sessionRepository);
export const getTransactionsUsecase = new GetTransactionsUseCase(walletRepository, userRepository,sessionRepository, adminRepository);
export const updateWalletBalanceUseCase = new UpdateWalletBalanceUseCase(walletRepository);
export const getWalletUsecase = new GetWalletUsecase(walletRepository);
export const topupWalletUsecase = new WalletTopUpUseCase(walletRepository, createTransactionUsecase, notifyUserUseCase);
export const withdrawWalletUsecase = new WithdrawWalletUseCase(walletRepository, createTransactionUsecase, notifyUserUseCase);

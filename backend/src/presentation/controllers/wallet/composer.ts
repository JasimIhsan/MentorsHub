import {
	createTransactionUsecase,
	createWalletUsecase,
	getTransactionsUsecase,
	getWalletUsecase,
	topupWalletUsecase,
	withdrawWalletUsecase,
} from "../../../application/usecases/wallet/composer";
import { CreateTransactionController } from "./create.transaction.controller";
import { CreateWalletController } from "./create.wallet.controller";
import { GetTransactionsController } from "./get.transactions.controller";
import { GetWalletController } from "./get.wallet.controller";
// import { UpdateWalletBalanceController } from "./update.wallet.balance.controller";
import { WalletTopUpController } from "./wallet.topup.controller";
import { WithdrawWalletController } from "./withdrawal.wallet.controller";

export const createWalletController = new CreateWalletController(createWalletUsecase);
export const createTransactionController = new CreateTransactionController(createTransactionUsecase);
// export const updateWalletBalanceController = new UpdateWalletBalanceController(updateWalletBalanceUseCase);
export const getTransactionsController = new GetTransactionsController(getTransactionsUsecase);
export const getWalletController = new GetWalletController(getWalletUsecase);
export const topupWalletController = new WalletTopUpController(topupWalletUsecase);
export const withdrawWalletController = new WithdrawWalletController(withdrawWalletUsecase);

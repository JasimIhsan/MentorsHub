import { requestWithdrawalUseCase } from "../../../application/usecases/withdrawal-request/composer";
import { RequestWithdrawalController } from "./request.withdrawal.controller";

export const requestWithdrawalController = new RequestWithdrawalController(requestWithdrawalUseCase);

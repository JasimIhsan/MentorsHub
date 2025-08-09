import { rescheduleRequestRepository, sessionRepository } from "../../../infrastructure/composer";
import { notifyUserUseCase } from "../notification/composer";
import { AcceptRescheduleRequestUseCase } from "./accept.reschedule.request.usecase";
import { CouterRescheduleRequestUseCase } from "./counter.reschedule.request.usecase";
import { CreateRescheduleRequestUseCase } from "./create.reschedule.request.usecase";

export const createRescheduleRequestUseCase = new CreateRescheduleRequestUseCase(rescheduleRequestRepository, sessionRepository, notifyUserUseCase);
export const couterRescheduleRequestUseCase = new CouterRescheduleRequestUseCase(rescheduleRequestRepository, sessionRepository, notifyUserUseCase);
export const acceptRescheduleRequestUseCase = new AcceptRescheduleRequestUseCase(rescheduleRequestRepository, sessionRepository);

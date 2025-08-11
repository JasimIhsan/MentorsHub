import { acceptRescheduleRequestUseCase, couterRescheduleRequestUseCase, createRescheduleRequestUseCase } from "../../../application/usecases/reschedule-session/composer";
import { AcceptRescheduleRequestController } from "./accept.reschedule.request.controller";
import { CouterRescheduleRequestController } from "./counter.reschedule.controller";
import { RescheduleSessionController } from "./reschedule.session.controller";

export const rescheduleSessionController = new RescheduleSessionController(createRescheduleRequestUseCase);
export const counterRescheduleRequestController = new CouterRescheduleRequestController(couterRescheduleRequestUseCase);
export const acceptRescheduleRequestController = new AcceptRescheduleRequestController(acceptRescheduleRequestUseCase);

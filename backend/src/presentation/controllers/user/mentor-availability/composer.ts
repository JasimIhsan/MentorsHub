import { getMentorAvailabilityToUserUseCase } from "../../../../application/usecases/user/mentor-availability/composer";
import { GetMentorAvailabilityToUserController } from "./get.mentor.availability.to.user.controller";

export const getMentorAvailabilityToUserController = new GetMentorAvailabilityToUserController(getMentorAvailabilityToUserUseCase);

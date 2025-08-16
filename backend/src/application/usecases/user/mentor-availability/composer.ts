import { specialAvailabilityRepository, weeklyAvailabilityRepository } from "../../../../infrastructure/composer";
import { GetMentorAvailabilityToUserUseCase } from "./get.mentor.availability.to.user.usecase";

export const getMentorAvailabilityToUserUseCase = new GetMentorAvailabilityToUserUseCase(specialAvailabilityRepository, weeklyAvailabilityRepository);

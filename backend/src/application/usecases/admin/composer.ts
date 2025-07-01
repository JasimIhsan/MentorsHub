import { AdminLoginUsecase } from "./auth/authentication";
import { adminRepository, hashService, mentorRepository, tokenService, userRepository } from "../../../infrastructure/composer";
import { GetAllUsersUsecase } from "./users.tab/get.all.users.usecase";
import { CreateUserUsecase } from "./users.tab/add.new.user.usecase";
import { UpdateUserStatusUsecase } from "./users.tab/update.status.user.usecase";
import { DeleteUserUseCase } from "./users.tab/delete.user.usecase";
import { UpdateUserUsecase } from "./users.tab/update.user.usecase";
import { VerifyMentorApplicationUseCase } from "./mentor-application.tab/verify.mentor.application.usecase";
import { createNotificationUseCase } from "../notification/composer";
import { Server } from "socket.io";

export const adminLoginUsecase = new AdminLoginUsecase(adminRepository, tokenService);
export const getAllUsersUsecase = new GetAllUsersUsecase(userRepository);
export const createUserUsecase = new CreateUserUsecase(userRepository, hashService);
export const updateUserStatusUseCase = new UpdateUserStatusUsecase(userRepository);
export const deleteUserUsecase = new DeleteUserUseCase(userRepository);
export const updateUserUsecase = new UpdateUserUsecase(userRepository);

export const verifyMentorApplicationUsecase = (io?: Server) => {
  return new VerifyMentorApplicationUseCase(mentorRepository, userRepository, createNotificationUseCase, io);
};
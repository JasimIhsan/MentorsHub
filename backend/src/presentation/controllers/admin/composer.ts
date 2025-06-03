import { adminRepository } from "../../../infrastructure/composer";
import { AdminLoginController } from "./auth/admin.login.controller";
import { adminLoginUsecase, createUserUsecase, deleteUserUsecase, getAllUsersUsecase, updateUserStatusUseCase, updateUserUsecase, verifyMentorApplicationUsecase } from "../../../application/usecases/admin/composer";
import { GetAllUsersController } from "./user-tab/get.all.users.controller";
import { CreateUserController } from "./user-tab/create.user.controller";
import { UpdateUserStatusController } from "./user-tab/update.user.status.controller";
import { DeleteUserController } from "./user-tab/delete.user.controller";
import { UpdateUserController } from "./user-tab/update.user.controller";
import { VerifyMentorApplicationController } from "./mentor-application-tab/verify.mentor.application.controller";
import { Server } from "socket.io";

export const adminLoginController = new AdminLoginController(adminLoginUsecase);
export const getAllUserController = new GetAllUsersController(getAllUsersUsecase);
export const createUserController = new CreateUserController(createUserUsecase);
export const updateUserStatusController = new UpdateUserStatusController(updateUserStatusUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUsecase);
export const updateUserController = new UpdateUserController(updateUserUsecase);

export const verifyMentorApplicationController = (io?: Server) => {
	return new VerifyMentorApplicationController(verifyMentorApplicationUsecase(io));
};

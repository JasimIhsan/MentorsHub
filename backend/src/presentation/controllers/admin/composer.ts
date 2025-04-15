import { adminRepository } from "../../../infrastructure/composer";
import { AdminLoginController } from "./auth/admin.login.controller";
import { adminLoginUsecase, createUserUsecase, deleteUserUsecase, fetchAllUsersUsecase, updateUserStatusUseCase, updateUserUsecase, verifyMentorApplicationUsecase } from "../../../application/usecases/admin/composer";
import { FetchAllUsersController } from "./user-tab/fetch.all.users.controller";
import { CreateUserController } from "./user-tab/create.user.controller";
import { UpdateUserStatusController } from "./user-tab/update.user.status.controller";
import { DeleteUserController } from "./user-tab/delete.user.controller";
import { UpdateUserController } from "./user-tab/update.user.controller";
import { VerifyMentorApplicationController } from "./mentor-application-tab/verify.mentor.application.controller";

export const adminLoginController = new AdminLoginController(adminLoginUsecase);
export const fetchAllUserController = new FetchAllUsersController(fetchAllUsersUsecase);
export const createUserController = new CreateUserController(createUserUsecase);
export const updateUserStatusController = new UpdateUserStatusController(updateUserStatusUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUsecase);
export const updateUserController = new UpdateUserController(updateUserUsecase);
export const verifyMentorApplicationController = new VerifyMentorApplicationController(verifyMentorApplicationUsecase);

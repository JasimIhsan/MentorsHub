import { adminRepository } from "../../../infrastructure/composer";
import { AdminLoginController } from "./admin.login.controller";
import { adminLoginUsecase, createUserUsecase, deleteUserUsecase, fetchAllUsersUsecase, updateUserStatusUseCase, updateUserUsecase } from "../../../application/usecases/admin/composer";
import { FetchAllUsersController } from "./fetch.all.users.controller";
import { CreateUserController } from "./create.user.controller";
import { UpdateUserStatusController } from "./update.user.status.controller";
import { DeleteUserController } from "./delete.user.controller";
import { UpdateUserController } from "./update.user.controller";

export const adminLoginController = new AdminLoginController(adminLoginUsecase);
export const fetchAllUserController = new FetchAllUsersController(fetchAllUsersUsecase);
export const createUserController = new CreateUserController(createUserUsecase);
export const updateUserStatusController = new UpdateUserStatusController(updateUserStatusUseCase);
export const deleteUserController = new DeleteUserController(deleteUserUsecase);
export const updateUserController = new UpdateUserController(updateUserUsecase);
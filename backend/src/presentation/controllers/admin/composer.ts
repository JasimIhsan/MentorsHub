import { adminRepository } from "../../../infrastructure/index";
import { AdminLoginController } from "./admin.login.controller";
import { adminLoginUsecase, createUserUsecase, fetchAllUsersUsecase, updateUserStatusUseCase } from "../../../application/usecases/admin";
import { FetchAllUsersController } from "./fetch.all.users.controller";
import { CreateUserController } from "./create.user.controller";
import { UpdateUserStatusController } from "./update.user.status.controller";

export const adminLoginController = new AdminLoginController(adminLoginUsecase);
export const fetchAllUserController = new FetchAllUsersController(fetchAllUsersUsecase);
export const createUserController = new CreateUserController(createUserUsecase);
export const updateUserStatusController = new UpdateUserStatusController(updateUserStatusUseCase);

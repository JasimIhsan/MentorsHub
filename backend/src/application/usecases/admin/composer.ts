import { AdminLoginUsecase } from "./auth/authentication";
import { adminRepository, tokenInterface, userRepository } from "../../../infrastructure/composer";
import { FetchAllUsersUsecase } from "./users.tab/fetch.all.users.usecase";
import { CreateUserUsecase } from "./users.tab/add.new.user.usecase";
import { UpdateUserStatusUsecase } from "./users.tab/update.status.user.usecase";
import { DeleteUserUseCase } from "./users.tab/delete.user.usecase";
import { UpdateUserUsecase } from "./users.tab/update.user.usecase";

export const adminLoginUsecase = new AdminLoginUsecase(adminRepository, tokenInterface);
export const fetchAllUsersUsecase = new FetchAllUsersUsecase(userRepository);
export const createUserUsecase = new CreateUserUsecase(userRepository);
export const updateUserStatusUseCase = new UpdateUserStatusUsecase(userRepository);
export const deleteUserUsecase = new DeleteUserUseCase(userRepository);
export const updateUserUsecase = new UpdateUserUsecase(userRepository);


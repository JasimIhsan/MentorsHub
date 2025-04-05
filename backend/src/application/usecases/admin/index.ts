import { AdminLoginUsecase } from "./auth/authentication";
import { adminRepository, tokenInterface, userRepository } from "../../../infrastructure/index";
import { FetchAllUsersUsecase } from "./dashboard/fetch.all.users.usecase";

export const adminLoginUsecase = new AdminLoginUsecase(adminRepository, tokenInterface);
export const fetchAllUsersUsecase = new FetchAllUsersUsecase(userRepository);

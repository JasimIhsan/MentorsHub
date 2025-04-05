import { adminRepository } from "../../../infrastructure/index";
import { AdminLoginController } from "./admin.login.controller";
import { adminLoginUsecase, fetchAllUsersUsecase } from "../../../application/usecases/admin";
import { FetchAllUsersController } from "./fetch.all.users.controller";

export const adminLoginController = new AdminLoginController(adminLoginUsecase);
export const fetchAllUserController = new FetchAllUsersController(fetchAllUsersUsecase);

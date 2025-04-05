import { SignupUseCase } from "../usecases/authentication/signup.usecase";
import { UserRepositoryImpl } from "../../infrastructure/database/implementation/user/user.repository.impl";



export class AuthService {
	constructor(userRepository : UserRepositoryImpl){}
}
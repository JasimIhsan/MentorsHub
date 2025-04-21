import { UserRepositoryImpl } from "../../../infrastructure/database/implementation/user.repository.impl";

export class AuthService {
	constructor(userRepository: UserRepositoryImpl) {}
}

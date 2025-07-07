import { IUserRepository } from "../../../../domain/repositories/user.repository";
import { UserEntity, UserRole } from "../../../../domain/entities/user.entity";
import { IUserDTO, mapToUserDTO } from "../../../dtos/user.dtos";
import { ICreateUserUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";
import { IHashService } from "../../../interfaces/services/hash.service";

export class CreateUserUsecase implements ICreateUserUsecase {
	constructor(private userRepository: IUserRepository, private hashService: IHashService) {} 
	async execute(firstName: string, lastName: string, email: string, role: UserRole): Promise<IUserDTO> {
		try {
			const isUserExists = await this.userRepository.findUserByEmail(email);
			if (isUserExists) {
				throw new Error("User already exists with this email");
			}

			const password = this.hashService.generatePassword();
			const hashedPassword = await this.hashService.hashPassword(password);

			const userEntity = new UserEntity({ firstName, lastName, email, password: hashedPassword, role });
			const newUser = await this.userRepository.createUser(userEntity);
			return mapToUserDTO(newUser);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("An error occurred while adding a new user");
		}
	}
}

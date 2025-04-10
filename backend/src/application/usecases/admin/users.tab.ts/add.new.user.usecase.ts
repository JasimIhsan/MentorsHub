import { IUserRepository } from "../../../../domain/dbrepository/user.repository";
import { UserEntity, UserRole } from "../../../../domain/entities/user.entity";
import { IUserDTO, UserDTO } from "../../../dtos/user.dtos";
import { ICreateUserUsecase } from "../../../interfaces/admin/admin.usertab.interfaces";
import { generatePassword } from "../../../../infrastructure/utils/generate.password";

export class CreateUserUsecase implements ICreateUserUsecase {
	constructor(private userRepository: IUserRepository) {} // Replace 'any' with the actual type of userRepository
	async execute(firstName: string, lastName: string, email: string, role: UserRole): Promise<IUserDTO> {
		// Replace 'any' with the actual type of userData
		try {
			const isUserExists = await this.userRepository.findUserByEmail(email);
			if (isUserExists) {
				throw new Error("User already exists with this email");
			}

			const password = generatePassword();

			const userEntity = await UserEntity.create(email, password, firstName, lastName, role);
			const newUser = await this.userRepository.createUser(userEntity);
			return UserDTO.fromEntity(newUser);
		} catch (error) {
			if (error instanceof Error) {
				throw new Error(error.message);
			}
			throw new Error("An error occurred while adding a new user");
		}
	}
}

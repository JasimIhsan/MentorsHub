"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserUsecase = void 0;
const user_entity_1 = require("../../../../domain/entities/user.entity");
const user_dtos_1 = require("../../../dtos/user.dtos");
const generate_password_1 = require("../../../../infrastructure/services/utils/generate.password");
class CreateUserUsecase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    } // Replace 'any' with the actual type of userRepository
    execute(firstName, lastName, email, role) {
        return __awaiter(this, void 0, void 0, function* () {
            // Replace 'any' with the actual type of userData
            try {
                const isUserExists = yield this.userRepository.findUserByEmail(email);
                if (isUserExists) {
                    throw new Error("User already exists with this email");
                }
                const password = (0, generate_password_1.generatePassword)();
                const userEntity = yield user_entity_1.UserEntity.create(email, password, firstName, lastName, role);
                const newUser = yield this.userRepository.createUser(userEntity);
                return user_dtos_1.UserDTO.fromEntity(newUser);
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error("An error occurred while adding a new user");
            }
        });
    }
}
exports.CreateUserUsecase = CreateUserUsecase;

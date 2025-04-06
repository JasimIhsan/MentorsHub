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
exports.UpdateUserStatusUsecase = void 0;
const user_dtos_1 = require("../../../dtos/user.dtos");
class UpdateUserStatusUsecase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }
            user.toggleStatus(user.getStatus() === "blocked" ? "unblocked" : "blocked");
            const updatedUser = yield this.userRepository.updateUser(user);
            if (!updatedUser) {
                throw new Error("Failed to update user status");
            }
            return user_dtos_1.UserDTO.fromEntity(updatedUser);
        });
    }
}
exports.UpdateUserStatusUsecase = UpdateUserStatusUsecase;

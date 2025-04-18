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
exports.FetchAllUsersUsecase = void 0;
class FetchAllUsersUsecase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.userRepository.findAllUsers();
                return users;
            }
            catch (error) {
                if (error instanceof Error) {
                    throw new Error(error.message);
                }
                throw new Error("An error occurred while fetching users");
            }
        });
    }
}
exports.FetchAllUsersUsecase = FetchAllUsersUsecase;

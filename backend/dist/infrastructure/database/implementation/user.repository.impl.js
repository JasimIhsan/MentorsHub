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
exports.UserRepositoryImpl = void 0;
const user_model_1 = require("../models/user.model");
// Helper function for error handling
const handleError = (error, message) => {
    console.error(`${message}:`, error);
    throw new Error(error instanceof Error ? error.message : message);
};
class UserRepositoryImpl {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new user_model_1.UserModel(user);
                return yield newUser.save();
            }
            catch (error) {
                return handleError(error, "Error creating user");
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.UserModel.findOne({ email });
            }
            catch (error) {
                return handleError(error, "Error finding user by email");
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.UserModel.findById(id);
            }
            catch (error) {
                return handleError(error, "Error finding user by ID");
            }
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;

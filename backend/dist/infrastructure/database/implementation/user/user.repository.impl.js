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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepositoryImpl = exports.handleError = void 0;
const user_entity_1 = require("../../../../domain/entities/user.entity");
const user_model_1 = require("../../models/user/user.model");
const mongoose_1 = __importDefault(require("mongoose"));
const user_dtos_1 = require("../../../../application/dtos/user.dtos");
// Helper function for error handling
const handleError = (error, message) => {
    console.error(`${message}:`, error);
    throw new Error(error instanceof Error ? error.message : message);
};
exports.handleError = handleError;
class UserRepositoryImpl {
    createUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const newUser = new user_model_1.UserModel(user);
                const savedUser = yield newUser.save();
                return user_entity_1.UserEntity.fromDBDocument(savedUser);
            }
            catch (error) {
                return (0, exports.handleError)(error, "Error creating user");
            }
        });
    }
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDoc = yield user_model_1.UserModel.findOne({ email });
                return userDoc ? user_entity_1.UserEntity.fromDBDocument(userDoc) : null;
            }
            catch (error) {
                return (0, exports.handleError)(error, "Error finding user by email");
            }
        });
    }
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.default.Types.ObjectId.isValid(id))
                    return null; // Validate MongoDB ObjectId
                const userDoc = yield user_model_1.UserModel.findById(id);
                return userDoc ? user_entity_1.UserEntity.fromDBDocument(userDoc) : null;
            }
            catch (error) {
                return (0, exports.handleError)(error, "Error finding user by ID");
            }
        });
    }
    save(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield user_model_1.UserModel.findByIdAndUpdate(user.getId(), user.getProfile(true), { upsert: true, new: true });
            }
            catch (error) {
                (0, exports.handleError)(error, "Error saving user");
            }
        });
    }
    findAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDocs = yield user_model_1.UserModel.find();
                const usersData = userDocs.map((doc) => user_entity_1.UserEntity.fromDBDocument(doc));
                return usersData.map((user) => user_dtos_1.UserDTO.fromEntity(user));
            }
            catch (error) {
                return (0, exports.handleError)(error, "Error fetching all users");
            }
        });
    }
    updateUser(user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedUser = yield user_model_1.UserModel.findByIdAndUpdate(user.getId(), user.getProfile(true), { new: true });
                return updatedUser ? user_entity_1.UserEntity.fromDBDocument(updatedUser) : null;
            }
            catch (error) {
                return (0, exports.handleError)(error, "Error updating user");
            }
        });
    }
}
exports.UserRepositoryImpl = UserRepositoryImpl;

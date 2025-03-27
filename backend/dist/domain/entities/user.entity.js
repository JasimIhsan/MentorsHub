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
exports.UserEntity = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
// ✅ BaseEntity for common properties
class BaseEntity {
    constructor(id, createdAt, updatedAt) {
        this.id = id;
        this.createdAt = createdAt || new Date();
        this.updatedAt = updatedAt || null;
    }
    getId() {
        return this.id;
    }
}
// UserEntity with proper encapsulation
class UserEntity extends BaseEntity {
    // Private constructor to enforce controlled instance creation
    constructor(user) {
        var _a;
        super(user.id, user.createdAt, user.updatedAt);
        this.email = user.email;
        this.password = user.password;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.role = user.role || "user";
        this.avatar = user.avatar || null;
        this.bio = user.bio || null;
        this.interests = user.interests || null;
        this.skills = user.skills || null;
        this.isActive = (_a = user.isActive) !== null && _a !== void 0 ? _a : true;
        this.location = user.location || { city: null, country: null, timezone: null };
        this.lastActive = user.lastActive || null;
        this.isVerified = user.isVerified || false;
        this.mentorProfileId = user.mentorProfileId || null;
        this.mentorRequestStatus = user.mentorRequestStatus || null;
        this.rating = user.rating || null;
        this.sessionCompleted = user.sessionCompleted || null;
        this.featuredMentor = user.featuredMentor || null;
        this.badges = user.badges || null;
    }
    // Factory method for creating a new UserEntity
    static create(email, password, firstName, lastName) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            return new UserEntity({ email, password: hashedPassword, firstName, lastName });
        });
    }
    // Password validation
    isPasswordValid(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(plainPassword, this.password);
        });
    }
    // Getters for accessing private fields safely
    getEmail() {
        return this.email;
    }
    getRole() {
        return this.role;
    }
    getName() {
        return `${this.firstName} ${this.lastName}`;
    }
    getProfile() {
        return {
            id: this.id,
            email: this.email,
            firstName: this.firstName,
            lastName: this.lastName,
            role: this.role,
            avatar: this.avatar,
            bio: this.bio,
            interests: this.interests,
            skills: this.skills,
            isActive: this.isActive,
            isVerified: this.isVerified,
            mentorProfileId: this.mentorProfileId,
            mentorRequestStatus: this.mentorRequestStatus,
            rating: this.rating,
            sessionCompleted: this.sessionCompleted,
            featuredMentor: this.featuredMentor,
            badges: this.badges,
            location: this.location,
        };
    }
}
exports.UserEntity = UserEntity;

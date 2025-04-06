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
// UserEntity Class
class UserEntity {
    constructor(user) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
        this.id = user.id;
        this.email = user.email;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.password = user.password;
        this.role = user.role || "user";
        this.status = user.status || "unblocked";
        this.avatar = (_a = user.avatar) !== null && _a !== void 0 ? _a : null;
        this.bio = (_b = user.bio) !== null && _b !== void 0 ? _b : null;
        this.interests = (_c = user.interests) !== null && _c !== void 0 ? _c : null;
        this.skills = (_d = user.skills) !== null && _d !== void 0 ? _d : null;
        this.badges = (_e = user.badges) !== null && _e !== void 0 ? _e : null;
        this.sessionCompleted = (_f = user.sessionCompleted) !== null && _f !== void 0 ? _f : 0;
        // this.location = user.location as IUserLocation ?? { city: null, country: null, timezone: null } as IUserLocation;
        this.mentorDetailsId = (_g = user.mentorDetailsId) !== null && _g !== void 0 ? _g : null;
        this.googleId = (_h = user.googleId) !== null && _h !== void 0 ? _h : null;
        this.createdAt = (_j = user.createdAt) !== null && _j !== void 0 ? _j : new Date();
        this.updatedAt = (_k = user.updatedAt) !== null && _k !== void 0 ? _k : null;
    }
    // Static method to create a new user with hashed password
    static create(email_1, password_1, firstName_1, lastName_1) {
        return __awaiter(this, arguments, void 0, function* (email, password, firstName, lastName, role = "user") {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            return new UserEntity({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                status: "unblocked",
                role,
                sessionCompleted: 0,
                createdAt: new Date(),
            });
        });
    }
    static createWithGoogle(email, password, firstName, lastName, googleId, avatar) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            return new UserEntity({
                email,
                password: hashedPassword,
                firstName,
                lastName,
                status: "unblocked",
                sessionCompleted: 0,
                googleId: googleId !== null && googleId !== void 0 ? googleId : null,
                avatar,
                createdAt: new Date(),
            });
        });
    }
    // Convert MongoDB user document to UserEntity
    static fromDBDocument(userDoc) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        return new UserEntity({
            id: (_a = userDoc._id) === null || _a === void 0 ? void 0 : _a.toString(),
            email: userDoc.email,
            password: userDoc.password,
            firstName: userDoc.firstName,
            lastName: userDoc.lastName,
            role: userDoc.role || "user",
            avatar: (_b = userDoc.avatar) !== null && _b !== void 0 ? _b : null,
            bio: (_c = userDoc.bio) !== null && _c !== void 0 ? _c : null,
            interests: (_d = userDoc.interests) !== null && _d !== void 0 ? _d : null,
            skills: (_e = userDoc.skills) !== null && _e !== void 0 ? _e : null,
            status: userDoc.status || "unblocked",
            googleId: (_f = userDoc.googleId) !== null && _f !== void 0 ? _f : null,
            // location: userDoc.location ?? { city: null, country: null, timezone: null },
            mentorDetailsId: (_g = userDoc.mentorDetails) !== null && _g !== void 0 ? _g : {},
            sessionCompleted: (_h = userDoc.sessionCompleted) !== null && _h !== void 0 ? _h : 0,
            badges: (_j = userDoc.badges) !== null && _j !== void 0 ? _j : null,
            createdAt: (_k = userDoc.createdAt) !== null && _k !== void 0 ? _k : new Date(),
            updatedAt: (_l = userDoc.updatedAt) !== null && _l !== void 0 ? _l : null,
        });
    }
    // Hash password
    static hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.hash(password, 10);
        });
    }
    // Validate password
    isPasswordValid(plainPassword) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("plainPassword: ", plainPassword);
            console.log("this.password: ", this.password);
            return bcrypt_1.default.compare(plainPassword, this.password);
        });
    }
    // Update user details
    updateUserDetails(updatedData) {
        console.log("pasword before: ", this.password);
        if (updatedData.password !== undefined)
            this.password = updatedData.password;
        if (updatedData.email !== undefined)
            this.email = updatedData.email;
        if (updatedData.firstName !== undefined)
            this.firstName = updatedData.firstName;
        if (updatedData.lastName !== undefined)
            this.lastName = updatedData.lastName;
        if (updatedData.avatar !== undefined)
            this.avatar = updatedData.avatar;
        if (updatedData.bio !== undefined)
            this.bio = updatedData.bio;
        if (updatedData.interests !== undefined)
            this.interests = updatedData.interests;
        if (updatedData.skills !== undefined)
            this.skills = updatedData.skills;
        if (updatedData.badges !== undefined)
            this.badges = updatedData.badges;
        if (updatedData.sessionCompleted !== undefined)
            this.sessionCompleted = updatedData.sessionCompleted;
        if (updatedData.mentorDetailsId !== undefined)
            this.mentorDetailsId = updatedData.mentorDetailsId;
        this.updatedAt = new Date();
        console.log("pasword after : ", this.password);
    }
    // Toggle active status
    toggleStatus(status) {
        this.status = status;
    }
    // Getters
    getId() {
        return this.id;
    }
    getEmail() {
        return this.email;
    }
    getRole() {
        return this.role;
    }
    getName() {
        return `${this.firstName} ${this.lastName}`;
    }
    getStatus() {
        return this.status;
    }
    getProfile(includePassword = false) {
        return Object.assign({ email: this.email, firstName: this.firstName, lastName: this.lastName, role: this.role, avatar: this.avatar, status: this.status, bio: this.bio, interests: this.interests, skills: this.skills, badges: this.badges, sessionCompleted: this.sessionCompleted, 
            // location: this.location,
            mentorDetailsId: this.mentorDetailsId, createdAt: this.createdAt, updatedAt: this.updatedAt }, (includePassword ? { password: this.password } : {}));
    }
}
exports.UserEntity = UserEntity;

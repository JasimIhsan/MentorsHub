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
exports.AdminEntity = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
class AdminEntity {
    constructor(admin) {
        this.id = admin.id;
        this.name = admin.name;
        this.username = admin.username;
        this.password = admin.password;
        this.isSuperAdmin = admin.isSuperAdmin;
        this.avatar = admin.avatar;
    }
    static createAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPassword = yield bcrypt_1.default.hash(admin.password, 10);
            return new AdminEntity(Object.assign(Object.assign({}, admin), { password: hashedPassword }));
        });
    }
    static fromDBDocument(doc) {
        return new AdminEntity({
            id: doc.id,
            name: doc.name,
            avatar: doc.avatar,
            username: doc.username,
            password: doc.password,
            isSuperAdmin: doc.isSuperAdmin,
        });
    }
    comparePassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield bcrypt_1.default.compare(password, this.password);
        });
    }
    getProfile() {
        return {
            id: this.id,
            name: this.name,
            avatar: this.avatar,
            username: this.username,
            password: this.password,
            isSuperAdmin: this.isSuperAdmin,
        };
    }
    getId() {
        return this.id;
    }
    getUsername() {
        return this.username;
    }
    getPassword() {
        return this.password;
    }
    getIsSuperAdmin() {
        return this.isSuperAdmin;
    }
}
exports.AdminEntity = AdminEntity;

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
exports.AdminRepositoryImpl = void 0;
const admin_dtos_1 = require("../../../../application/dtos/admin.dtos");
const admin_entity_1 = require("../../../../domain/entities/admin.entity");
const admin_model_1 = require("../../models/admin/admin.model");
class AdminRepositoryImpl {
    createAdmin(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminModel = new admin_model_1.AdminModel(admin);
            const savedAdmin = yield adminModel.save();
            const adminEntity = admin_entity_1.AdminEntity.fromDBDocument(savedAdmin);
            return admin_dtos_1.AdminDTO.fromEntity(adminEntity);
        });
    }
    findAdminById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminModel = yield admin_model_1.AdminModel.findById(id);
            if (adminModel) {
                const adminEntity = admin_entity_1.AdminEntity.fromDBDocument(adminModel);
                return admin_dtos_1.AdminDTO.fromEntity(adminEntity);
            }
            return null;
        });
    }
    findAdminByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminModel = yield admin_model_1.AdminModel.findOne({ username });
            if (adminModel) {
                const adminEntity = admin_entity_1.AdminEntity.fromDBDocument(adminModel);
                return admin_dtos_1.AdminDTO.fromEntity(adminEntity);
            }
            return null;
        });
    }
    save(admin) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminModel = new admin_model_1.AdminModel(admin);
            yield adminModel.save();
        });
    }
}
exports.AdminRepositoryImpl = AdminRepositoryImpl;

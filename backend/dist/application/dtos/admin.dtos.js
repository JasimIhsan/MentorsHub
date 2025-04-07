"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminDTO = void 0;
class AdminDTO {
    constructor(id, name, username, password, isSuperAdmin, avatar) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.avatar = avatar || "";
        this.password = password;
        this.isSuperAdmin = isSuperAdmin;
    }
    static fromEntity(admin) {
        return new AdminDTO(admin.getId() || "", admin.getProfile().name || "", admin.getUsername(), admin.getPassword(), admin.getIsSuperAdmin(), admin.getProfile().avatar);
    }
}
exports.AdminDTO = AdminDTO;

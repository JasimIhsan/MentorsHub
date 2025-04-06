"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserDTO = void 0;
class UserDTO {
    constructor(id, email, fullName, role, avatar, bio, status, interests, skills, badges, sessionCompleted, mentorDetailsId, createdAt, updatedAt) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.avatar = avatar !== null && avatar !== void 0 ? avatar : "";
        this.bio = bio;
        this.status = status;
        this.interests = interests;
        this.skills = skills;
        this.badges = badges;
        this.sessionCompleted = sessionCompleted;
        this.mentorDetailsId = mentorDetailsId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    static fromEntity(user) {
        var _a, _b, _c, _d, _e, _f, _g, _h, _j;
        const profile = user.getProfile();
        return new UserDTO(user.getId(), user.getEmail(), user.getName(), user.getRole(), (_a = profile.avatar) !== null && _a !== void 0 ? _a : "", (_b = profile.bio) !== null && _b !== void 0 ? _b : null, (_c = profile.status) !== null && _c !== void 0 ? _c : "unblocked", (_d = profile.interests) !== null && _d !== void 0 ? _d : null, (_e = profile.skills) !== null && _e !== void 0 ? _e : null, (_f = profile.badges) !== null && _f !== void 0 ? _f : null, (_g = profile.sessionCompleted) !== null && _g !== void 0 ? _g : 0, (_h = profile.mentorDetailsId) !== null && _h !== void 0 ? _h : null, profile.createdAt, (_j = profile.updatedAt) !== null && _j !== void 0 ? _j : null);
    }
}
exports.UserDTO = UserDTO;

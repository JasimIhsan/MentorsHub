"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MentorProfileEntity = void 0;
class MentorProfileEntity {
    constructor(mentorProfile) {
        this.mentorProfile = mentorProfile;
    }
    static create(userId, data) {
        return new MentorProfileEntity({
            userId,
            certifications: data.certifications || [],
            education: data.education || [],
            expertiseIn: data.expertiseIn || null,
            title: data.title || null,
            yearOfExperience: data.yearOfExperience || null,
            createdAt: new Date(),
            updatedAt: data.updatedAt || null,
        });
    }
}
exports.MentorProfileEntity = MentorProfileEntity;

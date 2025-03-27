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
exports.MentorDetailsRespositoryImpl = void 0;
const mentor_details_model_1 = require("../models/mentor.details.model");
// Helper function for error handling
const handleError = (error, message) => {
    console.error(`${message}:`, error);
    throw new Error(error instanceof Error ? error.message : message);
};
class MentorDetailsRespositoryImpl {
    create(mentorDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createdMentorDetails = new mentor_details_model_1.MentorDetailsModel(mentorDetails);
                return yield createdMentorDetails.save();
            }
            catch (error) {
                return handleError(error, "Error creating mentor details");
            }
        });
    }
    update(userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mentor_details_model_1.MentorDetailsModel.findByIdAndUpdate(userId, data, { new: true });
            }
            catch (error) {
                return handleError(error, "Error updating mentor details");
            }
        });
    }
    findByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield mentor_details_model_1.MentorDetailsModel.findOne({ userId });
            }
            catch (error) {
                return handleError(error, "Error finding mentor details by user ID");
            }
        });
    }
}
exports.MentorDetailsRespositoryImpl = MentorDetailsRespositoryImpl;

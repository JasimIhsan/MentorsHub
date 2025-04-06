"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const UsersSchema = new mongoose_1.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    role: { type: String, enum: ["user", "mentor"], required: true, default: "user" },
    lastName: { type: String, required: true },
    avatar: { type: String },
    bio: { type: String },
    interests: [{ type: String }],
    skills: [{ type: String }],
    status: { type: String, enum: ["blocked", "unblocked"], default: "unblocked" },
    location: {
        city: { type: String },
        country: { type: String },
        timezone: { type: String },
    },
    lastActive: { type: Date },
    isVerified: { type: Boolean },
    mentorProfileId: { type: mongoose_1.Schema.Types.ObjectId, ref: "MentorProfile" },
    mentorRequestStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
    },
    rating: { type: Number },
    sessionCompleted: { type: Number },
    featuredMentor: { type: Boolean },
    badges: [{ type: mongoose_1.Schema.Types.ObjectId }],
    googleId: { type: String },
}, { timestamps: true });
exports.UserModel = mongoose_1.default.model("Users", UsersSchema);

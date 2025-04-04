"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenServices = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const JWT_ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN;
const JWT_REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN;
if (!JWT_ACCESS_TOKEN || !JWT_REFRESH_TOKEN) {
    throw new Error("JWT secret keys are missing in .env file!");
}
class TokenServices {
    generateAccessToken(payload) {
        return jsonwebtoken_1.default.sign(Object.assign({}, payload), JWT_ACCESS_TOKEN, { expiresIn: "5m" });
    }
    generateRefreshToken(payload) {
        return jsonwebtoken_1.default.sign(Object.assign({}, payload), JWT_REFRESH_TOKEN, { expiresIn: "15m" });
    }
    validateAccessToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_ACCESS_TOKEN);
        }
        catch (error) {
            return null;
        }
    }
    validateRefreshToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, JWT_REFRESH_TOKEN);
        }
        catch (error) {
            return null;
        }
    }
}
exports.TokenServices = TokenServices;

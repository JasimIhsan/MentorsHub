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
exports.configurePassport = void 0;
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const dotenv_1 = __importDefault(require("dotenv"));
const user_entity_1 = require("../../../domain/entities/user.entity");
dotenv_1.default.config();
const configurePassport = (userRepo, tokenService) => {
    passport_1.default.use(new passport_google_oauth20_1.Strategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
    }, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f;
        try {
            const email = (_b = (_a = profile.emails) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
            if (!email) {
                return done(new Error("Google email is required"), false);
            }
            let user = yield userRepo.findUserByEmail(email);
            if (!user) {
                user = yield userRepo.createUser(yield user_entity_1.UserEntity.createWithGoogle(email, "", ((_c = profile.name) === null || _c === void 0 ? void 0 : _c.givenName) || "", ((_d = profile.name) === null || _d === void 0 ? void 0 : _d.familyName) || "", profile.id, ((_f = (_e = profile.photos) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.value) || ""));
            }
            const jwtAccessToken = tokenService.generateAccessToken(user.getId());
            const jwtRefreshToken = tokenService.generateRefreshToken(user.getId());
            return done(null, { user, accessToken: jwtAccessToken, refreshToken: jwtRefreshToken });
        }
        catch (error) {
            return done(error, false);
        }
    })));
    passport_1.default.serializeUser((user, done) => {
        done(null, user);
    });
    passport_1.default.deserializeUser((obj, done) => {
        done(null, obj);
    });
};
exports.configurePassport = configurePassport;

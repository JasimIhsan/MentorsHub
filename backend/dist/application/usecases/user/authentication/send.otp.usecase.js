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
exports.SendOtpUsecase = void 0;
const generate_otp_1 = require("../../../../infrastructure/services/utils/generate.otp");
class SendOtpUsecase {
    constructor(emailService, userRepo, redisService) {
        this.emailService = emailService;
        this.userRepo = userRepo;
        this.redisService = redisService;
    }
    execute(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isExists = yield this.userRepo.findUserByEmail(email);
            if (isExists)
                throw new Error("User already exists");
            const otp = (0, generate_otp_1.generateOtp)();
            yield this.redisService.setCachedData(`otp:${email}`, otp, 600);
            yield this.emailService.sendOtpEmail(email, otp);
        });
    }
}
exports.SendOtpUsecase = SendOtpUsecase;

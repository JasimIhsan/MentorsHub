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
exports.VerifyOtpUsecase = void 0;
class VerifyOtpUsecase {
    constructor(redisService) {
        this.redisService = redisService;
    }
    execute(email, enteredOtp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("email in verify otp: ", email);
            const cachedOtp = yield this.redisService.getCachedData(`otp:${email}`);
            console.log("cachedOtp: ", cachedOtp);
            if (!cachedOtp) {
                throw new Error("OTP not found");
            }
            if (cachedOtp === enteredOtp) {
                yield this.redisService.removeCachedData(`otp:${email}`);
                return true;
            }
            return false;
        });
    }
}
exports.VerifyOtpUsecase = VerifyOtpUsecase;

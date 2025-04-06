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
exports.SendOtpController = void 0;
class SendOtpController {
    constructor(sendOtpUseCase) {
        this.sendOtpUseCase = sendOtpUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`in send`);
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({ success: false, message: "Email is required" });
                    return;
                }
                yield this.sendOtpUseCase.execute(email);
                res.status(200).json({ success: true, message: "OTP sent successfully" });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error("Send OTP error:", error.message);
                    res.status(400).json({ success: false, message: error.message });
                    return;
                }
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
}
exports.SendOtpController = SendOtpController;

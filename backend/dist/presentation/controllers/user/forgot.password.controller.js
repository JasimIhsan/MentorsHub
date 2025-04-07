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
exports.ForgotPasswrodController = void 0;
class ForgotPasswrodController {
    constructor(forgotUseCase) {
        this.forgotUseCase = forgotUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email } = req.body;
                if (!email) {
                    res.status(400).json({ success: false, error: "Email is required" });
                    return;
                }
                yield this.forgotUseCase.execute(email);
                res.status(200).json({ success: true, message: "Password reset link sent to your email" });
            }
            catch (error) {
                console.error("Forgot password error:", error);
                if (error instanceof Error)
                    res.status(500).json({ success: false, error: error.message || "Failed to send magic link" });
            }
        });
    }
}
exports.ForgotPasswrodController = ForgotPasswrodController;

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
exports.ResetPasswordController = void 0;
class ResetPasswordController {
    constructor(restPasswordUseCase) {
        this.restPasswordUseCase = restPasswordUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token, newPassword } = req.body;
                yield this.restPasswordUseCase.execute(token, newPassword);
                res.status(200).json({ success: true, message: "Password reset successfully" });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log("error from controller: ", error.message);
                    res.status(400).json({ message: error.message });
                    return;
                }
                res.status(400).json({ message: "Internal server error" });
            }
        });
    }
}
exports.ResetPasswordController = ResetPasswordController;

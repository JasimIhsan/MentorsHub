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
exports.VerifyResetTokenController = void 0;
class VerifyResetTokenController {
    constructor(verifyTokenUseCase) {
        this.verifyTokenUseCase = verifyTokenUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { token } = req.params;
                if (!token) {
                    res.status(400).json({ success: false, message: "Token is required" });
                    return;
                }
                const isValid = yield this.verifyTokenUseCase.execute(token);
                console.log('isValid: ', isValid);
                if (isValid) {
                    res.status(200).json({ success: true, message: "Token is valid" });
                }
                else {
                    res.status(400).json({ success: false, message: "Token is invalid" });
                }
            }
            catch (error) {
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
}
exports.VerifyResetTokenController = VerifyResetTokenController;

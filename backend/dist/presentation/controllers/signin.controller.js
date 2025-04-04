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
exports.SigninController = void 0;
class SigninController {
    constructor(signinUseCase) {
        this.signinUseCase = signinUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                const { user, accessToken, refreshToken } = yield this.signinUseCase.execute(email, password);
                res.cookie("refresh-token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000 });
                res.cookie("access-token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });
                res.status(200).json({ success: true, user });
            }
            catch (error) {
                if (error instanceof Error) {
                    res.status(400).json({ success: false, error: error.message });
                }
                console.log("Error from signin controller", error);
                res.status(500).json({ success: false, error: "Internal Server Error" });
            }
        });
    }
}
exports.SigninController = SigninController;

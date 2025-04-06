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
                console.log(`in login controller`);
                const { email, password } = req.body;
                const { user, accessToken, refreshToken } = yield this.signinUseCase.execute(email, password);
                res.cookie("refresh_token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000, secure: true });
                res.cookie("access_token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000, secure: true });
                res.status(200).json({ success: true, user });
            }
            catch (error) {
                console.log(`error in login controller: `, error);
                if (error instanceof Error) {
                    console.log(error.message);
                    res.status(404).json({ success: false, message: error.message });
                    return;
                }
                res.status(500).json({ success: false, message: "Internal Server Error" });
            }
        });
    }
}
exports.SigninController = SigninController;

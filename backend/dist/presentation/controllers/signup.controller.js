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
exports.SignupController = void 0;
class SignupController {
    constructor(signupUseCase) {
        this.signupUseCase = signupUseCase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, firstName, lastName } = req.body;
                const { user, refreshToken, accessToken } = yield this.signupUseCase.execute(email, password, firstName, lastName);
                res.cookie("refresh-token", refreshToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 15 * 1000 });
                res.cookie("access-token", accessToken, { httpOnly: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });
                res.status(201).json({ success: true, user });
            }
            catch (error) {
                res.status(400).json({ success: false, message: error.message });
            }
        });
    }
}
exports.SignupController = SignupController;

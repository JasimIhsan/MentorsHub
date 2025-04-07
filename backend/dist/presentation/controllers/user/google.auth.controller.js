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
exports.GoogleAuthController = void 0;
class GoogleAuthController {
    constructor(googleAuthUsecase) {
        this.googleAuthUsecase = googleAuthUsecase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { credential } = req.body;
                console.log('credentials: ', credential);
                const { user, accessToken, refreshToken } = yield this.googleAuthUsecase.execute(credential);
                if (!user || !accessToken || !refreshToken) {
                    res.status(401).json({ message: "Unauthorized" });
                    return;
                }
                res.cookie("access_token", accessToken, { httpOnly: true, secure: true, sameSite: "strict" });
                res.cookie("refresh_token", refreshToken, { httpOnly: true, secure: true, sameSite: "strict" });
                res.status(200).json({ success: true, user: user });
            }
            catch (error) {
                if (error instanceof Error) {
                    console.log("error from controller: ", error.message);
                    res.status(400).json({ message: error.message });
                    return;
                }
                console.log("An error occurred while google authentication: ", error);
                res.status(500).json({ message: "An error occurred while google authentication" });
                return;
            }
        });
    }
}
exports.GoogleAuthController = GoogleAuthController;

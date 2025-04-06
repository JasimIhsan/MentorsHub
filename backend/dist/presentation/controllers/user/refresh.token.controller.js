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
exports.RefreshTokenController = void 0;
class RefreshTokenController {
    constructor(refreshUsecase) {
        this.refreshUsecase = refreshUsecase;
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = req.body;
            const newAccessToken = this.refreshUsecase.execute(user.userId);
            res.clearCookie("access_token");
            res.cookie("access_token", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 60 * 5 * 1000 });
            res.status(200).json({ success: true, accessToken: newAccessToken, message: "New access token generated" });
        });
    }
}
exports.RefreshTokenController = RefreshTokenController;

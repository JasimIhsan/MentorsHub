"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.googleAuthRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
const composer_1 = require("../../controllers/user/composer");
exports.googleAuthRouter = (0, express_1.Router)();
// Redirect to Google
exports.googleAuthRouter.post("/google", (req, res) => composer_1.googleAuthController.handle(req, res));
// Google OAuth callback
exports.googleAuthRouter.get("/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/login", session: false }), (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: "Authentication failed" });
        return;
    }
    const { user, accessToken, refreshToken } = req.user;
    res.redirect(`http://localhost:3000?token=${accessToken}&refresh=${refreshToken}`);
});

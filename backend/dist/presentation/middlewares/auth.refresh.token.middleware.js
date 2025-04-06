"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = void 0;
const jwt_services_1 = require("../../infrastructure/jwt/jwt.services");
const tokenService = new jwt_services_1.TokenServicesImpl();
const verifyRefreshToken = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(401).json({ success: false, message: "Refresh token is missing" });
            return;
        }
        // const refreshToken = refreshToken.split(" ")[1];
        const decoded = tokenService.validateRefreshToken(refreshToken);
        if (!decoded) {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
            return;
        }
        req.body = decoded;
        next();
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.verifyRefreshToken = verifyRefreshToken;

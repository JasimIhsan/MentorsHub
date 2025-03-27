"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = void 0;
const jwt_services_1 = require("../../infrastructure/jwt/jwt.services");
const tokenService = new jwt_services_1.TokenServices();
const verifyAccessToken = (req, res, next) => {
    var _a;
    try {
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
        if (!token) {
            res.status(401).json({ success: false, message: "Token not provided" });
            return;
        }
        const decoded = tokenService.validateAccessToken(token);
        if (!decoded) {
            res.status(401).json({ success: false, message: "Invalid token" });
            return;
        }
        // req.user = decoded;
        next();
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
exports.verifyAccessToken = verifyAccessToken;

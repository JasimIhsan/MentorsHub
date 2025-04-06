"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthRouter = void 0;
const express_1 = require("express");
const composer_1 = require("../../controllers/admin/composer");
exports.adminAuthRouter = (0, express_1.Router)();
exports.adminAuthRouter.post("/login", (req, res) => composer_1.adminLoginController.handle(req, res));

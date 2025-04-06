"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const config_1 = __importDefault(require("./infrastructure/database/config"));
const auth_routes_1 = __importDefault(require("./presentation/routes/user/auth.routes"));
const passport_1 = __importDefault(require("passport"));
const google_auth_routes_1 = require("./presentation/routes/user/google.auth.routes");
const passport_config_1 = require("./infrastructure/services/passport/passport.config");
const infrastructure_1 = require("./infrastructure");
const admin_auth_routes_1 = require("./presentation/routes/admin/admin.auth.routes");
const admin_usertab_routes_1 = require("./presentation/routes/admin/admin.usertab.routes");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(passport_1.default.initialize());
(0, passport_config_1.configurePassport)(infrastructure_1.userRepository, infrastructure_1.tokenInterface);
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
}));
(0, config_1.default)();
app.use((0, morgan_1.default)("dev"));
app.use("/api", auth_routes_1.default);
app.use("/api/auth", google_auth_routes_1.googleAuthRouter);
app.use("/api/admin", admin_auth_routes_1.adminAuthRouter);
app.use("/api/admin/users", admin_usertab_routes_1.usertabRouter);
app.listen(process.env.PORT, () => {
    console.log(` Server is running  : ✅✅✅`);
});

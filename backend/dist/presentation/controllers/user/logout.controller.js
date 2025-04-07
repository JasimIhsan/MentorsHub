"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogoutController = void 0;
class LogoutController {
    handle(req, res) {
        try {
            res.clearCookie("access_token");
            res.clearCookie("refresh_token");
            res.status(200).json({ success: true, message: "Logged out successfully" });
        }
        catch (error) {
            if (error instanceof Error) {
                console.log("error from controller: ", error.message);
                res.status(400).json({ message: error.message });
                return;
            }
            console.log("An error occurred while logging out: ", error);
            res.status(500).json({ message: "An error occurred while logging out" });
            return;
        }
    }
}
exports.LogoutController = LogoutController;

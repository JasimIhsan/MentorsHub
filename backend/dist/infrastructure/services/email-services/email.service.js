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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailServiceImpl = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class EmailServiceImpl {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            service: "Gmail",
            auth: {
                user: "mentorshub000@gmail.com",
                pass: "bffs evgc xnnq qzyh",
            },
        });
    }
    loadTemplate(templateName) {
        const templatePath = path_1.default.join(__dirname, "templates", `${templateName}.html`);
        return fs_1.default.readFileSync(templatePath, "utf-8");
    }
    sendPasswordResetEmail(email, token, username) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`in sendPasswordResetEmail`);
            const url = `http://localhost:5173/reset-password/${token}`;
            let template = this.loadTemplate("reset.email.template");
            template = template.replace("{{reset_link}}", url);
            template = template.replace("{{user_name}}", username);
            const mailOptions = {
                from: "MentorsHub <no-reply@mentorshub.com>",
                to: email,
                subject: "Password Reset Request",
                html: template,
            };
            yield this.transporter.sendMail(mailOptions);
        });
    }
    sendOtpEmail(email, otp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`in sendOtpEmail`);
            let template = this.loadTemplate("otp.email.template");
            template = template.replace("{{otp_code}}", otp);
            const mailOptions = {
                from: "MentorsHub <no-reply@mentorshub.com>",
                to: email,
                subject: "One Time Password (OTP)",
                html: template,
            };
            console.log("otp email sent");
            yield this.transporter.sendMail(mailOptions);
        });
    }
}
exports.EmailServiceImpl = EmailServiceImpl;

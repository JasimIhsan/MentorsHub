import nodemailer from "nodemailer";
import { IEmailService } from "../../../application/interfaces/user/email.service.interface";
import fs from "fs";
import path from "path";

export class EmailServiceImpl implements IEmailService {
	private transporter: nodemailer.Transporter;
	constructor() {
		this.transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: "mentorshub000@gmail.com",
				pass: "bffs evgc xnnq qzyh",
			},
		});
	}

	private loadTemplate(templateName: string) {
		const templatePath = path.join(__dirname, "templates", `${templateName}.html`);
		return fs.readFileSync(templatePath, "utf-8");
	}

	async sendPasswordResetEmail(email: string, token: string, username: string): Promise<void> {
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

		await this.transporter.sendMail(mailOptions);
	}

	async sendOtpEmail(email: string, otp: string) {
		let template = this.loadTemplate("otp.email.template");
		template = template.replace("{{otp_code}}", otp);
		const mailOptions = {
			from: "MentorsHub <no-reply@mentorshub.com>",
			to: email,
			subject: "One Time Password (OTP)",
			html: template,
		};
		await this.transporter.sendMail(mailOptions);
	}
}

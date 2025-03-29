// src/components/auth/AuthContainer.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import OtpVerificationForm from "./OtpVerificationForm";
import { ISignupData } from "@/interfaces/interfaces";

type FormState = "login" | "signup" | "forgot-password" | "reset-password" | "otp-varification";

export default function AuthContainer() {
	const [formState, setFormState] = useState<FormState>("login");
	const [signupData, setSignupData] = useState<ISignupData | null>(null);

	return (
		<div className="flex flex-1 items-center justify-center h-screen bg-white p-8 md:p-12 lg:p-16">
			<Card className="w-full max-w-md border shadow-lg">
				<CardContent className="p-0">
					{formState === "login" && <LoginForm setFormState={setFormState} />}
					{formState === "signup" && <SignupForm setFormState={setFormState} setSignupData={setSignupData} />}
					{formState === "forgot-password" && <ForgotPasswordForm setFormState={setFormState} />}
					{formState === "otp-varification" && signupData && <OtpVerificationForm setFormState={setFormState} signupData={signupData} />}
				</CardContent>
			</Card>
		</div>
	);
}

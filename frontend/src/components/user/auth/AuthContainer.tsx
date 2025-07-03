import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";
import OtpVerificationForm from "./OtpVerificationForm";
import { ISignupData } from "@/interfaces/interfaces";

type FormState = "login" | "signup" | "forgot-password" | "otp-verification";

export default function AuthContainer() {
	const [formState, setFormState] = useState<FormState>("login");
	const [signupData, setSignupData] = useState<ISignupData | null>(null);

	return (
		<div className="flex flex-1 items-center justify-center bg-gray-50 p-4 sm:p-6 md:p-8 lg:p-12">
			<Card className="w-full max-w-md sm:max-w-lg border border-gray-200 shadow-xl rounded-xl">
				<CardContent className="p-3 sm:p-6 md:p-7">
					{formState === "login" && <LoginForm setFormState={setFormState} />}
					{formState === "signup" && <SignupForm  setFormState={setFormState} setSignupData={setSignupData} />}
					{formState === "forgot-password" && <ForgotPasswordForm setFormState={setFormState} />}
					{formState === "otp-verification" && signupData && <OtpVerificationForm setFormState={setFormState} signupData={signupData} />}
				</CardContent>
			</Card>
		</div>
	);
}

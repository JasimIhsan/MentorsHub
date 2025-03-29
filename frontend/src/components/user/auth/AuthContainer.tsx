// src/components/auth/AuthContainer.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import ForgotPasswordForm from "./ForgotPasswordForm";

type FormState = "login" | "signup" | "forgot-password" | "reset-password";

export default function AuthContainer() {
	const [formState, setFormState] = useState<FormState>("login");

	return (
		<div className="flex flex-1 items-center justify-center h-screen bg-white p-8 md:p-12 lg:p-16">
			<Card className="w-full max-w-md border shadow-lg">
				<CardContent className="p-0">
					{formState === "login" && <LoginForm setFormState={setFormState} />}
					{formState === "signup" && <SignupForm setFormState={setFormState} />}
					{formState === "forgot-password" && <ForgotPasswordForm setFormState={setFormState} />}
				</CardContent>
			</Card>
		</div>
	);
}

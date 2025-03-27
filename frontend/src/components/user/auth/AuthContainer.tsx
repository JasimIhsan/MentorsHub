// src/components/auth/AuthContainer.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

export default function AuthContainer() {
	const [isLogin, setIsLogin] = useState(true);

	return (
		<div className="flex flex-1 items-center justify-center bg-white p-8 md:p-12 lg:p-16">
			<Card className="w-full max-w-md border shadow-lg">
				<CardContent className="p-0">{isLogin ? <LoginForm setIsLogin={setIsLogin} /> : <SignupForm setIsLogin={setIsLogin} />}</CardContent>
			</Card>
		</div>
	);
}

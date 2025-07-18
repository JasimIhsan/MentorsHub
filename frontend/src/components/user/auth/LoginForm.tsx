import { LucideLogIn, LucideEye, LucideEyeOff, Mail, Lock } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schema/auth.form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userSlice";
import { toast } from "sonner";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "./GoogleLoginButton";
import { loginApi } from "@/api/user/authentication.api.service";

type FormState = "login" | "signup" | "forgot-password";

interface LoginFormProps {
	setFormState: (value: FormState) => void;
}

export default function LoginForm({ setFormState }: LoginFormProps) {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			const response = await loginApi(data.email, data.password);
			if (response.success) {
				dispatch(login(response.user));
				form.reset();
				navigate("/dashboard", { replace: true });
				toast.success("Login successful");
			}
		} catch (error) {
			console.error("Login error:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<>
			<CardHeader className="mb-4">
				<CardTitle className="text-xl sm:text-2xl">Login to your account</CardTitle>
				<CardDescription>Enter your email and password to access your account</CardDescription>
			</CardHeader>

			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-5 px-4 sm:px-6 md:px-8">
					<GoogleLoginButton />
					<div className="relative w-full my-4">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-muted"></span>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-muted-foreground">Or continue with</span>
						</div>
					</div>

					<div className="space-y-3">
						<Label htmlFor="email">Email</Label>
						<div className="relative">
							<Input id="email" type="email" className="pl-10" placeholder="m@example.com" {...form.register("email")} />
							<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
						</div>
						{form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
					</div>
					<div className="space-y-3">
						<Label htmlFor="password">Password</Label>
						<div className="relative">
							<Input id="password" className="pl-10" type={showPassword ? "text" : "password"} {...form.register("password")} />
							<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<button
								type="button"
								className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary"
								onClick={() => setShowPassword(!showPassword)} // Toggle password visibility
							>
								{showPassword ? <LucideEyeOff className="h-4 w-4" /> : <LucideEye className="h-4 w-4" />}
							</button>
						</div>
						{form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
					</div>
					<div className="text-right">
						<button type="button" onClick={() => setFormState("forgot-password")} className="text-sm text-primary hover:underline">
							Forgot Password?
						</button>
					</div>
				</div>
				<CardFooter className="flex flex-col space-y-4 my-4 px-4 sm:px-6 md:px-8">
					<Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting}>
						<LucideLogIn className="mr-2 h-4 w-4" />
						Login
					</Button>
					<p className="text-center text-sm text-muted-foreground">
						Don’t have an account?{" "}
						<button type="button" onClick={() => setFormState("signup")} className="text-primary hover:underline hover:cursor-pointer">
							Sign up
						</button>
					</p>
				</CardFooter>
			</form>
		</>
	);
}

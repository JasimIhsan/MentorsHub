// src/components/auth/LoginForm.tsx
import { LucideLogIn } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginFormData, loginSchema } from "@/schema/auth.form";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import axiosInstance from "@/api/api.config";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import GoogleLoginButton from "./GoogleLoginButton";
// import { adminLogout } from "@/store/slices/adminAuthSlice";
// import { RootState } from "@/store/store";

type FormState = "login" | "signup" | "forgot-password";

interface LoginFormProps {
	setFormState: (value: FormState) => void;
}

export default function LoginForm({ setFormState }: LoginFormProps) {
	// const isAdminAuthenticated = useSelector((state: RootState) => state.adminAuth.isAuthenticated);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const form = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { email: "", password: "" },
	});

	const onSubmit = async (data: LoginFormData) => {
		try {
			const response = await axiosInstance.post("/login", data);
			if (response.data.success) {
				// if (isAdminAuthenticated) {
				// 	dispatch(adminLogout());
				// }
				dispatch(login(response.data.user));

				form.reset();
				navigate("/dashboard", { replace: true });
				toast.success("Login successful");
			}
		} catch (error: any) {
			console.error("Login error:", error);
			toast.error(error.response.data.error);
		}
	};

	return (
		<>
			<CardHeader className="mb-4">
				<CardTitle className="text-xl">Login to your account</CardTitle>
				<CardDescription>Enter your email and password to access your account</CardDescription>
			</CardHeader>

			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-4 px-6">
					<GoogleLoginButton />
					<div className="relative w-full my-4">
						<div className="absolute inset-0 flex items-center">
							<span className="w-full border-t border-muted"></span>
						</div>
						<div className="relative flex justify-center text-xs uppercase">
							<span className="bg-white px-2 text-muted-foreground">Or continue with</span>
						</div>
					</div>

					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} />
						{form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="password">Password</Label>
						<Input id="password" type="password" {...form.register("password")} />
						{form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
					</div>
					<div className="text-right">
						<button type="button" onClick={() => setFormState("forgot-password")} className="text-sm text-primary hover:underline">
							Forgot Password?
						</button>
					</div>
				</div>
				<CardFooter className="flex flex-col space-y-4 my-4 px-6">
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

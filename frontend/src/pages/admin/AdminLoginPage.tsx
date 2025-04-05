import { useState } from "react";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { adminLoginAPI } from "@/api/admin/authenticate";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLogin } from "@/store/slices/adminAuthSlice";
import { logout } from "@/store/slices/authSlice";

// Define validation schema with Zod
const loginSchema = z.object({
	username: z.string().min(3, "Username must be at least 3 characters").max(50, "Username must not exceed 50 characters"),
	password: z.string().min(8, "Password must be at least 8 characters").max(100, "Password must not exceed 100 characters"),
	// .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
	const [showPassword, setShowPassword] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const form = useForm<LoginForm>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			username: "",
			password: "",
		},
	});

	const onSubmit = async (data: LoginForm) => {
		// setIsLoading(true);
		try {
			const response = await adminLoginAPI(data.username, data.password);
			console.log("response from admin login : ", response);

			if (response.success) {
				// navigate('/admin/dashboard', { replace: true });
				navigate("/admin/dashboard");
				dispatch(logout());
				dispatch(adminLogin(response.admin));
				toast.success("Login successful!");
			} else {
				toast.error(response.message || "Login failed. Please try again.");
			}
		} catch (error) {
			console.log("error: ", error);

			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				toast.error("An unexpected error occurred. Please try again.");
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
			<div className="w-full max-w-md">
				<Card className="border-none shadow-lg">
					<CardHeader className="space-y-1">
						<div className="flex justify-center mb-2">
							<div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
								<Lock className="h-6 w-6 text-primary" />
							</div>
						</div>
						<CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
						<CardDescription className="text-center">Enter your credentials to access the admin panel</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
							<div className="space-y-2">
								<Label htmlFor="username">Username</Label>
								<div className="relative">
									<Input id="username" type="text" placeholder="Enter your username" className="pl-10" disabled={isLoading} {...form.register("username")} />
									<User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
								</div>
								{form.formState.errors.username && <p className="text-sm text-destructive">{form.formState.errors.username.message}</p>}
							</div>

							<div className="space-y-2">
								<Label htmlFor="password">Password</Label>
								<div className="relative">
									<Input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" className="pr-10 pl-10" disabled={isLoading} {...form.register("password")} />
									<Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
									<Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
										{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
										<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
									</Button>
								</div>
								{form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
							</div>

							{form.formState.errors.root && <p className="text-sm text-destructive text-center">{form.formState.errors.root.message}</p>}

							<Button className="w-full mt-6" type="submit" disabled={isLoading}>
								{isLoading ? "Logging in..." : "Login"}
							</Button>
						</form>
					</CardContent>
					{/* <CardFooter className="flex justify-center">
						<Button variant="link" className="text-sm text-muted-foreground">
							Forgot password?
						</Button>
					</CardFooter> */}
				</Card>
			</div>
		</div>
	);
}

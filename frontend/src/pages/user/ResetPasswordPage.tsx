"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { resetPassword, verifyResetToken } from "@/api/user/authentication";
// import { useToast } from "@/hooks/use-toast";

// Define the schema for the reset password form
const resetPasswordSchema = z
	.object({
		password: z.string().min(8, "Password must be at least 8 characters long"),
		confirmPassword: z.string().min(8, "Confirm password must be at least 8 characters long"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords do not match",
		path: ["confirmPassword"],
	});

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordPage() {
	const { token } = useParams();
	const navigate = useNavigate();
	const [isLoading, setIsLoading] = useState(false);
	const [isTokenValid, setIsTokenValid] = useState(true);
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	const form = useForm<ResetPasswordFormData>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: { password: "", confirmPassword: "" },
	});

	const handleTokenInvalid = () => {
		setIsTokenValid(false);
		// Redirect after a short delay to allow the user to read the toast
		toast.error("Invalid or expired link. Please request a new password reset link.");
		setTimeout(() => {
			navigate("/authenticate");
		}, 5000);
	};

	// Verify the token when the component mounts
	useEffect(() => {
		if (!token) {
			handleTokenInvalid();
			return;
		}

		const verifyToken = async () => {
			setIsLoading(true);
			try {
				const response = await verifyResetToken(token);
				if (!response.success) {
					handleTokenInvalid();
				} else {
					setIsTokenValid(true);
				}
			} catch (error) {
				console.error("Token verification error:", error);
				handleTokenInvalid();
			} finally {
				setIsLoading(false);
			}
		};

		verifyToken();
	}, [token]);

	const onSubmit = async (data: ResetPasswordFormData) => {
		if (!token || !isTokenValid) {
			toast.error("Invalid or missing token");
			return;
		}

		setIsLoading(true);
		try {
			// This would be your actual API call to reset the password
			const response = await resetPassword(token, data.password);
			console.log(response)
			if (response.success) {
				navigate("/authenticate");
				toast.success("Password reset successful. Please log in with your new password.");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			} else {
				const errorMessage = "Failed to reset password. Please try again.";
				toast.error(errorMessage);
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
						<CardTitle className="text-2xl font-bold text-center">Reset Your Password</CardTitle>
						<CardDescription className="text-center">Enter your new password below to reset your account password</CardDescription>
					</CardHeader>
					<CardContent>
						{isTokenValid ? (
							<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
								<div className="space-y-2">
									<Label htmlFor="password">New Password</Label>
									<div className="relative">
										<Input id="password" type={showPassword ? "text" : "password"} className="pr-10" {...form.register("password")} disabled={isLoading} />
										<Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>
											{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											<span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
										</Button>
									</div>
									{form.formState.errors.password && <p className="text-sm text-destructive">{form.formState.errors.password.message}</p>}
								</div>
								<div className="space-y-2">
									<Label htmlFor="confirmPassword">Confirm Password</Label>
									<div className="relative">
										<Input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} className="pr-10" {...form.register("confirmPassword")} disabled={isLoading} />
										<Button type="button" variant="ghost" size="icon" className="absolute right-0 top-0 h-10 w-10 text-muted-foreground" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
											{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
											<span className="sr-only">{showConfirmPassword ? "Hide password" : "Show password"}</span>
										</Button>
									</div>
									{form.formState.errors.confirmPassword && <p className="text-sm text-destructive">{form.formState.errors.confirmPassword.message}</p>}
								</div>
								<Button className="w-full mt-6" type="submit" disabled={isLoading}>
									{isLoading ? "Resetting Password..." : "Reset Password"}
								</Button>
							</form>
						) : (
							<div className="text-center py-4">
								<p className="text-destructive mb-4">This password reset link is invalid or has expired.</p>
								<p className="text-muted-foreground">Redirecting you to the login page...</p>
							</div>
						)}
					</CardContent>
					<CardFooter className="flex flex-col space-y-4">
						<div className="text-center text-sm text-muted-foreground">
							<span>Remember your password? </span>
							<Button variant="link" className="p-0 h-auto" onClick={() => navigate("/authenticate")}>
								Back to login
							</Button>
						</div>
					</CardFooter>
				</Card>
			</div>
		</div>
	);
}

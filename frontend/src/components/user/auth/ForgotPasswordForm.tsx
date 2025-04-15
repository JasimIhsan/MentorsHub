import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ArrowLeft, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { forgotPassword } from "@/api/user/authentication.api.service";

// Define the schema for the forgot password form
const forgotPasswordSchema = z.object({
	email: z.string().email("Please enter a valid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

type FormState = "login" | "signup" | "forgot-password";

interface ForgotPasswordFormProps {
	setFormState: (value: FormState) => void;
}

export default function ForgotPasswordForm({ setFormState }: ForgotPasswordFormProps) {
	const form = useForm<ForgotPasswordFormData>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: { email: "" },
	});

	const onSubmit = async (data: ForgotPasswordFormData) => {
		try {
			const response = await forgotPassword(data.email);
			if (response.data.success) {
				toast.success("Password reset link has been sent to your email");
				form.reset();
				setFormState("login"); 
			}
		} catch (error: any) {
			console.error("Forgot password error:", error);
			toast.error(error.message || "Failed to send link. Please try again.");
		}
	};

	return (
		<>
			<CardHeader className="mb-4">
				<CardTitle className="text-xl">Forgot Password</CardTitle>
				<CardDescription>Enter your email to receive a link to reset your password</CardDescription>
			</CardHeader>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-4 px-6">
					<div className="space-y-2">
						<Label htmlFor="email">Email</Label>
						<Input id="email" type="email" placeholder="m@example.com" {...form.register("email")} />
						{form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
					</div>
				</div>
				<CardFooter className="flex flex-col space-y-4 my-4 px-6">
					<Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting}>
						<Send />
						Send Link
					</Button>
					<Button variant="link" className="w-full" onClick={() => setFormState("login")} disabled={form.formState.isSubmitting}>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back to Login
					</Button>
				</CardFooter>
			</form>
		</>
	);
}

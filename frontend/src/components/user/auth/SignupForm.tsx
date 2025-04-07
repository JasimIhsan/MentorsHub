import { Loader2, LucideUserPlus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupFormData, signupSchema } from "@/schema/auth.form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ISignupData } from "@/interfaces/interfaces";
import { sendOtp } from "@/api/user/authentication";

type FormState = "login" | "signup" | "forgot-password" | "otp-varification";

interface SignupFormProps {
	setFormState: (value: FormState) => void;
	setSignupData: (data: ISignupData) => void;
}

export default function SignupForm({ setFormState, setSignupData }: SignupFormProps) {
	// const navigate = useNavigate();
	// const dispatch = useDispatch();

	const form = useForm<SignupFormData>({
		resolver: zodResolver(signupSchema),
		defaultValues: { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" },
	});

	const onSubmit = async (data: SignupFormData) => {
		try {
			const response = await sendOtp(data.email);
			if (response.success) {
				setSignupData({
					firstName: data.firstName,
					lastName: data.lastName || "",
					email: data.email,
					password: data.password,
				});
				setFormState("otp-varification");
				toast.success("OTP sent to your email");
			}
		} catch (error) {
			console.error("Signup error:", error);
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<>
			<CardHeader className="mb-4">
				<CardTitle className="text-xl">Create an account</CardTitle>
				<CardDescription>Enter your details to create a new account</CardDescription>
			</CardHeader>
			<form onSubmit={form.handleSubmit(onSubmit)}>
				<div className="space-y-4 px-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="first-name">First name</Label>
							<Input id="first-name" placeholder="John" {...form.register("firstName")} />
							{form.formState.errors.firstName && <p className="text-sm text-red-500">{form.formState.errors.firstName.message}</p>}
						</div>
						<div className="space-y-2">
							<Label htmlFor="last-name">Last name</Label>
							<Input id="last-name" placeholder="Doe" {...form.register("lastName")} />
							{form.formState.errors.lastName && <p className="text-sm text-red-500">{form.formState.errors.lastName.message}</p>}
						</div>
					</div>
					<div className="space-y-2">
						<Label htmlFor="signup-email">Email</Label>
						<Input id="signup-email" type="email" placeholder="m@example.com" {...form.register("email")} />
						{form.formState.errors.email && <p className="text-sm text-red-500">{form.formState.errors.email.message}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="signup-password">Password</Label>
						<Input id="signup-password" type="password" {...form.register("password")} />
						{form.formState.errors.password && <p className="text-sm text-red-500">{form.formState.errors.password.message}</p>}
					</div>
					<div className="space-y-2">
						<Label htmlFor="confirm-password">Confirm Password</Label>
						<Input id="confirm-password" type="password" {...form.register("confirmPassword")} />
						{form.formState.errors.confirmPassword && <p className="text-sm text-red-500">{form.formState.errors.confirmPassword.message}</p>}
					</div>
				</div>
				<CardFooter className="flex flex-col space-y-4 my-4 px-6">
					{!form.formState.isSubmitting ? (
						<Button className="w-full" size="lg" type="submit">
							<LucideUserPlus className="mr-2 h-4 w-4" />
							Create Account
						</Button>
					) : (
						<Button className="w-full" size="lg" type="submit" disabled={form.formState.isSubmitting}>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Sending OTP...
						</Button>
					)}
					<p className="text-center text-sm text-muted-foreground">
						Already have an account?{" "}
						<button type="button" onClick={() => setFormState("login")} className="text-primary hover:underline hover:cursor-pointer">
							Login
						</button>
					</p>
				</CardFooter>
			</form>
		</>
	);
}

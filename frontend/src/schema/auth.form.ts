import * as zode from "zod";

export const loginSchema = zode.object({
	email: zode.string().email("Invalid email address").min(1, "Email is required"),
	password: zode.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = zode
	.object({
		firstName: zode.string().min(1, "First Name is required"),
		lastName: zode.string().optional(),
		email: zode.string().email("Invalid email address").min(1, "Email is required"),
		password: zode.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: zode.string().min(6, "Confirm Password must be at least 6 characters"),
	})
	.refine((data) => data.password === data.confirmPassword, { message: "Password must match", path: ["confirmPassword"] });

export type LoginFormData = zode.infer<typeof loginSchema>;
export type SignupFormData = zode.infer<typeof signupSchema>;

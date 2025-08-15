// validationSchema.ts
import { z } from "zod";

export const updateProfileSchema = z.object({
	firstName: z.string().min(1, "First name is required").max(50, "First name must be 50 characters or less"),
	lastName: z.string().optional(),
	email: z.string().min(1, "Email is required").email("Invalid email address"),
	skills: z.array(z.string()).min(0), // Optional, no strict validation for skills
	interests: z.array(z.string()).min(0), // Optional, no strict validation for interests
	bio: z.string().max(500, "Bio must be 500 characters or less").optional(), // Optional bio
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

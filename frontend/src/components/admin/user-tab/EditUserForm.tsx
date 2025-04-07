import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { updateUserApi } from "@/api/admin/user.tab";
import { IUserDTO } from "@/interfaces/IUserDTO";

const formSchema = z.object({
	firstName: z.string().min(1, "First name is required").max(50, "First name must be 50 characters or less"),
	lastName: z.string().optional(),
	email: z.string().email("Invalid email address").min(1, "Email is required"),
	role: z.enum(["user", "mentor"], { required_error: "Role is required" }),
	sendEmail: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

interface EditUserFormProps {
	user: IUserDTO;
	updateUser: (updatedUser: IUserDTO) => void;
}

export function EditUserForm({ user, updateUser }: EditUserFormProps) {
	const [isOpen, setIsOpen] = useState(false);

	const {
		register,
		handleSubmit,
		reset,
		setValue,
		control,
		formState: { errors, isSubmitting },
	} = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			email: "",
			role: undefined,
			sendEmail: false,
		},
	});

	// Populate form with user data when dialog opens
	useEffect(() => {
		if (isOpen && user) {
			const [firstName, ...lastNameParts] = user.fullName ? user.fullName.split(" ") : [user.firstName || "", user.lastName || ""];
			reset({
				firstName: firstName || "",
				lastName: lastNameParts.join(" ") || "",
				email: user.email || "",
				role: (user.role as "user" | "mentor") || "user",
				sendEmail: false,
			});
		}
	}, [isOpen, user, reset]);

	const onSubmit = async (data: FormData) => {
		// Construct fullName for comparison and update
		const fullName = `${data.firstName} ${data.lastName || ""}`.trim();

		// Compare with initial user data
		const hasChanges = data.firstName !== (user.fullName?.split(" ")[0] || user.firstName) || (data.lastName || "") !== (user.fullName?.split(" ").slice(1).join(" ") || user.lastName || "") || data.role !== user.role || data.sendEmail !== false;

		if (!hasChanges) {
			setIsOpen(false);
			toast.info("No changes detected.");
			return;
		}

		try {
			const updatedData = {
				...data,
				fullName, // Include fullName for consistency with IUserDTO
			};

			const response = await updateUserApi(user.id as string, updatedData);
			if (response.success) {
				setIsOpen(false);
				const updatedUser: IUserDTO = {
					...user,
					fullName,
					firstName: data.firstName,
					lastName: data.lastName || "",
					email: data.email, // Still included in updatedUser even though read-only
					role: data.role,
					...(response.user || {}),
				};
				updateUser(updatedUser);
				toast.success("User updated successfully!");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<button className="w-full text-left hover:cursor-pointer" onClick={() => setIsOpen(true)}>
					Edit
				</button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Edit User</DialogTitle>
					<DialogDescription>Update the user’s account details</DialogDescription>
				</DialogHeader>
				<form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="firstName" className="text-right">
							First Name
						</Label>
						<div className="col-span-3">
							<Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
							{errors.firstName && <p className="mt-1 text-sm text-red-500">{errors.firstName.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="lastName" className="text-right">
							Last Name
						</Label>
						<div className="col-span-3">
							<Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
							{errors.lastName && <p className="mt-1 text-sm text-red-500">{errors.lastName.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="email" className="text-right">
							Email
						</Label>
						<div className="col-span-3">
							<Input
								id="email"
								type="email"
								{...register("email")}
								readOnly // Make email read-only
								className={errors.email ? "border-red-500" : "bg-gray-100 cursor-not-allowed"}
							/>
							{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="role" className="text-right">
							Role
						</Label>
						<div className="col-span-3">
							<Controller
								name="role"
								control={control}
								render={({ field }) => (
									<Select onValueChange={field.onChange} value={field.value}>
										<SelectTrigger className={errors.role ? "border-red-500" : ""}>
											<SelectValue placeholder="Select role" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="user">User</SelectItem>
											<SelectItem value="mentor">Mentor</SelectItem>
										</SelectContent>
									</Select>
								)}
							/>
							{errors.role && <p className="mt-1 text-sm text-red-500">{errors.role.message}</p>}
						</div>
					</div>
					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="send-email" className="text-right">
							Notifications
						</Label>
						<div className="col-span-3 flex items-center space-x-2">
							<Checkbox id="send-email" {...register("sendEmail")} onCheckedChange={(checked) => setValue("sendEmail", checked === true)} />
							<label htmlFor="send-email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
								Send update email
							</label>
						</div>
					</div>
					<DialogFooter>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Updating..." : "Update User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createUserApi } from "@/api/admin/user.tab";
import { useState } from "react";

const formSchema = z.object({
	firstName: z.string().min(1, "First name is required").max(50, "First name must be 50 characters or less"),
	lastName: z.string().min(1, "Last name is required").max(50, "Last name must be 50 characters or less"),
	email: z.string().email("Invalid email address").min(1, "Email is required"),
	role: z.enum(["user", "mentor"], { required_error: "Role is required" }),
	sendEmail: z.boolean().default(false),
});

type FormData = z.infer<typeof formSchema>;

export function AddUserForm() {
	const {
		register,
		handleSubmit,
		setValue,
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
	const [isOpen, setIsOpen] = useState(false);

	const onSubmit = async (data: FormData) => {
		try {
			console.log("Form submitted:", data);
			const response = await createUserApi(data);
			if (response.success) {
				setIsOpen(false);
				toast.success("User created successfully!");
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
				<Button onClick={() => setIsOpen(true)}>
					<Plus className="mr-2 h-4 w-4" />
					Add User
				</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Add New User</DialogTitle>
					<DialogDescription>Create a new user account on the platform</DialogDescription>
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
							<Input id="email" type="email" {...register("email")} className={errors.email ? "border-red-500" : ""} />
							{errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
						</div>
					</div>

					<div className="grid grid-cols-4 items-center gap-4">
						<Label htmlFor="role" className="text-right">
							Role
						</Label>
						<div className="col-span-3">
							<Select onValueChange={(value) => setValue("role", value as "user" | "mentor")}>
								<SelectTrigger className={errors.role ? "border-red-500" : ""}>
									<SelectValue placeholder="Select role" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="user">User</SelectItem>
									<SelectItem value="mentor">Mentor</SelectItem>
								</SelectContent>
							</Select>
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
								Send welcome email
							</label>
						</div>
					</div>

					<DialogFooter>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Creating..." : "Create User"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

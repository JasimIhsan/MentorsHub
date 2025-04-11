import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
// import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { X } from "lucide-react";

export default function PersonalInfoForm() {
	const form = useFormContext();

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-2 gap-4">
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={form.control}
				name="professionalTitle"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Professional Title</FormLabel>
						<FormControl>
							<Input {...field} placeholder="e.g. Senior Software Engineer" />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="bio"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Professional Bio</FormLabel>
						<FormControl>
							<Textarea {...field} placeholder="Tell us about yourself..." className="min-h-[150px]" />
						</FormControl>
						<p className="text-xs text-muted-foreground">This will be displayed on your mentor profile.</p>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="languages"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Languages Spoken</FormLabel>
						<FormControl>
							<Select
								onValueChange={(value) => {
									if (!field.value.includes(value)) {
										field.onChange([...field.value, value]);
									}
								}}>
								<SelectTrigger>
									<SelectValue placeholder="Select languages" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="english">English</SelectItem>
									<SelectItem value="malayalam">Malayalam</SelectItem>
									<SelectItem value="tamil">Tamil</SelectItem>
									<SelectItem value="kannada">Kannada</SelectItem>
									<SelectItem value="hindi">Hindi</SelectItem>
									<SelectItem value="telugu">Telugu</SelectItem>
									<SelectItem value="urdu">Urdu</SelectItem>
									<SelectItem value="punjabi">Punjabi</SelectItem>
									<SelectItem value="bengali">Bengali</SelectItem>
								</SelectContent>
							</Select>
						</FormControl>
						<div className="flex flex-wrap gap-2 mt-2">
							{field.value.map((lang: string) => (
								<span key={lang} className="text-sm bg-muted px-2 py-1 rounded flex ">
									{lang}
									<button type="button" onClick={() => field.onChange(field.value.filter((l: string) => l !== lang))} className="ml-2">
										<X className="h-3 w-3" />
									</button>
								</span>
							))}
						</div>
						<p className="text-xs text-muted-foreground">You can select multiple languages.</p>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}

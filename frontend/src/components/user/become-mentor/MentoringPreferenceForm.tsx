import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DollarSign } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function MentoringPreferencesForm() {
	const form = useFormContext();

	return (
		<div className="space-y-6">
			<FormField
				control={form.control}
				name="sessionFormat"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Session Format</FormLabel>
						<FormControl>
							<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="one-on-one" id="one-on-one" />
									<Label htmlFor="one-on-one" className="font-normal">
										One-on-One Sessions Only
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="group" id="group" />
									<Label htmlFor="group" className="font-normal">
										Group Sessions Only
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="both" id="both" />
									<Label htmlFor="both" className="font-normal">
										Both One-on-One and Group Sessions
									</Label>
								</div>
							</RadioGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="sessionTypes"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Session Type</FormLabel>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="video-calls"
									checked={field.value.includes("video-calls")}
									onCheckedChange={(checked) => {
										const updated = checked ? [...field.value, "video-calls"] : field.value.filter((v: string) => v !== "video-calls");
										field.onChange(updated);
									}}
								/>
								<Label htmlFor="video-calls" className="font-normal">
									Video Calls
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="chat"
									checked={field.value.includes("chat")}
									onCheckedChange={(checked) => {
										const updated = checked ? [...field.value, "chat"] : field.value.filter((v: string) => v !== "chat");
										field.onChange(updated);
									}}
								/>
								<Label htmlFor="chat" className="font-normal">
									Text Chat
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="in-person"
									checked={field.value.includes("in-person")}
									onCheckedChange={(checked) => {
										const updated = checked ? [...field.value, "in-person"] : field.value.filter((v: string) => v !== "in-person");
										field.onChange(updated);
									}}
								/>
								<Label htmlFor="in-person" className="font-normal">
									In-Person (if location permits)
								</Label>
							</div>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Separator />

			<FormField
				control={form.control}
				name="pricing"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Session Pricing</FormLabel>
						<FormControl>
							<RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-2">
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="free" id="free" />
									<Label htmlFor="free" className="font-normal">
										Free Sessions
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="paid" id="paid" />
									<Label htmlFor="paid" className="font-normal">
										Paid Sessions
									</Label>
								</div>
								<div className="flex items-center space-x-2">
									<RadioGroupItem value="both-pricing" id="both-pricing" />
									<Label htmlFor="both-pricing" className="font-normal">
										Both Free and Paid Sessions
									</Label>
								</div>
							</RadioGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="hourlyRate"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Hourly Rate (USD)</FormLabel>
						<FormControl>
							<div className="relative">
								<DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
								<Input {...field} className="pl-9" placeholder="e.g. 50" />
							</div>
						</FormControl>
						<p className="text-xs text-muted-foreground">Set your hourly rate for paid sessions. The platform fee is 15%.</p>
						<FormMessage />
					</FormItem>
				)}
			/>

			<Separator />

			<FormField
				control={form.control}
				name="availability"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Availability</FormLabel>
						<div className="space-y-2">
							<div className="flex items-center space-x-2">
								<Checkbox
									id="weekdays"
									checked={field.value.includes("weekdays")}
									onCheckedChange={(checked) => {
										const updated = checked ? [...field.value, "weekdays"] : field.value.filter((v: string) => v !== "weekdays");
										field.onChange(updated);
									}}
								/>
								<Label htmlFor="weekdays" className="font-normal">
									Weekdays
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="weekends"
									checked={field.value.includes("weekends")}
									onCheckedChange={(checked) => {
										const updated = checked ? [...field.value, "weekends"] : field.value.filter((v: string) => v !== "weekends");
										field.onChange(updated);
									}}
								/>
								<Label htmlFor="weekends" className="font-normal">
									Weekends
								</Label>
							</div>
							<div className="flex items-center space-x-2">
								<Checkbox
									id="evenings"
									checked={field.value.includes("evenings")}
									onCheckedChange={(checked) => {
										const updated = checked ? [...field.value, "evenings"] : field.value.filter((v: string) => v !== "evenings");
										field.onChange(updated);
									}}
								/>
								<Label htmlFor="evenings" className="font-normal">
									Evenings
								</Label>
							</div>
						</div>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="hoursPerWeek"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Hours Available Per Week</FormLabel>
						<FormControl>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger>
									<SelectValue placeholder="Select hours per week" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="1-5">1-5 hours</SelectItem>
									<SelectItem value="6-10">6-10 hours</SelectItem>
									<SelectItem value="11-20">11-20 hours</SelectItem>
									<SelectItem value="20+">20+ hours</SelectItem>
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="sessionLength"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Preferred Session Length</FormLabel>
						<FormControl>
							<Select onValueChange={field.onChange} defaultValue={field.value}>
								<SelectTrigger>
									<SelectValue placeholder="Select session length" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="30">30 minutes</SelectItem>
									<SelectItem value="45">45 minutes</SelectItem>
									<SelectItem value="60">60 minutes</SelectItem>
									<SelectItem value="90">90 minutes</SelectItem>
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}

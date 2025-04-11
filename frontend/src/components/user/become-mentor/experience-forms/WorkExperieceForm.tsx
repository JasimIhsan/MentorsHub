import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export  function WorkExperienceForm() {
	return (
		<div className="space-y-4">
			{/* Work Experience Form */}
			<div className="rounded-lg border p-4 space-y-4">
				<div className="space-y-2">
					<Label htmlFor="job-title">Job Title</Label>
					<Input id="job-title" placeholder="e.g. Senior Software Engineer" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="company">Company</Label>
					<Input id="company" placeholder="e.g. Acme Inc." />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="start-date">Start Date</Label>
						<Input id="start-date" type="month" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="end-date">End Date</Label>
						<Input id="end-date" type="month" />
						<div className="flex items-center space-x-2 mt-1">
							<Checkbox id="current-job" />
							<Label htmlFor="current-job" className="text-sm font-normal">
								I currently work here
							</Label>
						</div>
					</div>
				</div>

				<div className="space-y-2">
					<Label htmlFor="job-description">Description</Label>
					<Textarea id="job-description" placeholder="Describe your responsibilities and achievements..." />
				</div>
			</div>
		</div>
	);
}

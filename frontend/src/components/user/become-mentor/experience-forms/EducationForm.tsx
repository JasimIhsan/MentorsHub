import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export function EducationForm() {
	return (
		<div className="space-y-4">
			<div className="rounded-lg border p-4 space-y-4">
				<div className="space-y-2">
					<Label htmlFor="degree">Degree</Label>
					<Input id="degree" placeholder="e.g. Bachelor of Science in Computer Science" />
				</div>

				<div className="space-y-2">
					<Label htmlFor="institution">Institution</Label>
					<Input id="institution" placeholder="e.g. Stanford University" />
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label htmlFor="edu-start-date">Start Year</Label>
						<Input id="edu-start-date" type="number" placeholder="e.g. 2015" />
					</div>
					<div className="space-y-2">
						<Label htmlFor="edu-end-date">End Year</Label>
						<Input id="edu-end-date" type="number" placeholder="e.g. 2019" />
					</div>
				</div>
			</div>
		</div>
	);
}

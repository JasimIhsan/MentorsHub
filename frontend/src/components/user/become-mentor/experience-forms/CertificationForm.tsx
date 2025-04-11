import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export  function CertificationForm() {
	return (
		<div className="rounded-lg border p-4 space-y-4">
			<div className="space-y-2">
				<Label htmlFor="certification">Certification Name</Label>
				<Input id="certification" placeholder="e.g. AWS Certified Solutions Architect" />
			</div>

			<div className="space-y-2">
				<Label htmlFor="issuing-org">Issuing Organization</Label>
				<Input id="issuing-org" placeholder="e.g. Amazon Web Services" />
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label htmlFor="issue-date">Issue Date</Label>
					<Input id="issue-date" type="month" />
				</div>
				<div className="space-y-2">
					<Label htmlFor="expiry-date">Expiry Date (if applicable)</Label>
					<Input id="expiry-date" type="month" />
				</div>
			</div>
		</div>
	);
}

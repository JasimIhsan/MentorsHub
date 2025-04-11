import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload, BookOpen, X } from "lucide-react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

export default function DocumentsVerificationForm() {
	const form = useFormContext();
	const [files, setFiles] = useState<File[]>([]);

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const selectedFiles = event.target.files;
		if (selectedFiles) {
			const newFiles = Array.from(selectedFiles);
			setFiles((prev) => [...prev, ...newFiles]);
			form.setValue("documents", [...files, ...newFiles]); // Update form value with File objects
		}
	};

	const handleRemoveFile = (fileName: string) => {
		const updatedFiles = files.filter((file) => file.name !== fileName);
		setFiles(updatedFiles);
		form.setValue("documents", updatedFiles);
	};

	return (
		<div className="space-y-6">
			<div className="rounded-lg border border-dashed p-6 text-center">
				<div className="flex flex-col items-center gap-2">
					<Upload className="h-8 w-8 text-muted-foreground" />
					<h3 className="font-medium">Upload Supporting Documents</h3>
					<p className="text-sm text-muted-foreground">Upload your resume, certifications, or any other documents that verify your expertise</p>
					<Button type="button" className="mt-2" asChild>
						<label htmlFor="file-upload">
							<Upload className="mr-2 h-4 w-4" />
							Select Files
							<input id="file-upload" type="file" multiple accept=".pdf,.doc,.docx" onChange={handleFileChange} className="hidden" />
						</label>
					</Button>
				</div>
			</div>

			{files.length > 0 && (
				<FormField
					control={form.control}
					name="documents"
					render={() => (
						<FormItem>
							<FormLabel>Uploaded Documents</FormLabel>
							<div className="space-y-2">
								{files.map((file) => (
									<div key={file.name} className="flex items-center justify-between rounded-lg border p-3">
										<div className="flex items-center gap-2">
											<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
												<BookOpen className="h-5 w-5 text-primary" />
											</div>
											<div>
												<p className="font-medium">{file.name}</p>
												<p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
											</div>
										</div>
										<Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFile(file.name)}>
											<X className="h-4 w-4" />
											<span className="sr-only">Remove {file.name}</span>
										</Button>
									</div>
								))}
							</div>
							<FormMessage />
						</FormItem>
					)}
				/>
			)}

			<Separator />

			<div className="space-y-4">
				<FormLabel>Verification</FormLabel>
				<FormField
					control={form.control}
					name="terms"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<FormLabel className="text-sm font-normal">I confirm that all information provided is accurate and complete</FormLabel>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="guidelines"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<FormLabel className="text-sm font-normal">I have read and agree to the Mentor Guidelines and Code of Conduct</FormLabel>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="interview"
					render={({ field }) => (
						<FormItem className="flex items-center space-x-2">
							<FormControl>
								<Checkbox checked={field.value} onCheckedChange={field.onChange} />
							</FormControl>
							<FormLabel className="text-sm font-normal">I understand that I may be contacted for an interview as part of the verification process</FormLabel>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<div className="rounded-lg bg-muted p-4">
				<h3 className="font-medium mb-2">What happens next?</h3>
				<ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
					<li>Our admin team will review your application</li>
					<li>You may be contacted for additional information or an interview</li>
					<li>You'll receive a notification once your application is approved or rejected</li>
					<li>If approved, you'll gain access to the mentor dashboard and can start accepting sessions</li>
				</ol>
			</div>
		</div>
	);
}

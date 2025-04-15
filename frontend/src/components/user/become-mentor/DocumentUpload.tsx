// src/components/mentor-application/DocumentUpload.tsx
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, BookOpen, X } from "lucide-react";
import { FormErrors } from "@/types/mentor.application";

interface DocumentUploadProps {
	documents: File[];
	formErrors: FormErrors;
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	handleRemoveFile: (index: number) => void;
}

export function DocumentUpload({ documents, formErrors, handleFileChange, handleRemoveFile }: DocumentUploadProps) {
	return (
		<>
			<div className="rounded-lg border border-dashed p-4 sm:p-6 text-center">
				<div className="flex flex-col items-center gap-2">
					<Upload className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
					<h3 className="font-medium text-base sm:text-lg">Upload Supporting Documents</h3>
					<p className="text-xs sm:text-sm text-muted-foreground">Upload your resume, certifications, or any other documents that verify your expertise</p>
					<Button variant="outline" asChild>
						<label htmlFor="document-upload">
							<Upload className="mr-2 h-4 w-4" />
							Select Files
							<input id="document-upload" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
						</label>
					</Button>
				</div>
			</div>

			{documents.length > 0 && (
				<div className="space-y-2">
					<Label>Uploaded Documents</Label>
					<div className="space-y-2">
						{documents.map((file, index) => (
							<div key={index} className="flex items-center justify-between rounded-lg border p-3">
								<div className="flex items-center gap-2">
									<div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-primary/10">
										<BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
									</div>
									<div>
										<p className="font-medium text-sm sm:text-base">{file.name}</p>
										<p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
									</div>
								</div>
								<Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
									<X className="h-4 w-4" />
									<span className="sr-only">Remove {file.name}</span>
								</Button>
							</div>
						))}
					</div>
					{documents.some((_, index) => formErrors[`documents[${index}]`]) && (
						<div className="space-y-1">
							{documents.map((_, index) =>
								formErrors[`documents[${index}]`] ? (
									<p key={index} className="text-red-500 text-xs">
										{formErrors[`documents[${index}]`]}
									</p>
								) : null
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
}

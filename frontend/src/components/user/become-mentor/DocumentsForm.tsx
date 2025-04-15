// // src/components/mentor-application/DocumentsForm.tsx
// import { Separator } from "@/components/ui/separator";
// import { DocumentUpload } from "./DocumentUpload";
// import { VerificationSection } from "./VerificationSection";
// import { MentorApplication, FormErrors } from "@/types/mentor.application";

// interface DocumentsFormProps {
// 	formData: MentorApplication;
// 	formErrors: FormErrors;
// 	handleInputChange: (field: keyof MentorApplication, value: any) => void;
// 	handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
// 	handleRemoveFile: (index: number) => void;
// }

// export function DocumentsForm({ formData, formErrors, handleInputChange, handleFileChange, handleRemoveFile }: DocumentsFormProps) {
// 	return (
// 		<div className="space-y-6">
// 			<div className="space-y-4">
// 				<DocumentUpload documents={formData.documents} formErrors={formErrors} handleFileChange={handleFileChange} handleRemoveFile={handleRemoveFile} />
// 				<Separator />
// 				<VerificationSection formData={formData} formErrors={formErrors} handleInputChange={handleInputChange} />
// 				<div className="rounded-lg bg-muted p-4">
// 					<h3 className="font-medium text-base sm:text-lg mb-2">What happens next?</h3>
// 					<ol className="space-y-2 list-decimal list-inside text-xs sm:text-sm text-muted-foreground">
// 						<li>Our admin team will review your application</li>
// 						<li>You may be contacted for additional information or an interview</li>
// 						<li>You'll receive a notification once your application is approved or rejected</li>
// 						<li>If approved, you'll gain access to the mentor dashboard and can start accepting sessions</li>
// 					</ol>
// 				</div>
// 			</div>
// 		</div>
// 	);
// }

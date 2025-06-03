import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Upload, BookOpen, X } from "lucide-react";
import { MentorApplicationFormData } from "@/types/mentor.application";

interface DocumentsVerificationStepProps {
  formData: MentorApplicationFormData;
  handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleRemoveFile: (index: number) => void;
}

export function DocumentsVerificationStep({ formData, handleInputChange, handleFileChange, handleRemoveFile }: DocumentsVerificationStepProps) {
  return (
    <>
      <div className="space-y-4">
        <div className="rounded-lg border border-dashed p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8 text-gray-500" />
            <h3 className="font-medium">Upload Supporting Documents</h3>
            <p className="text-sm text-gray-500">Upload your resume, certifications, or any other documents that verify your expertise</p>
            <Button variant="outline" asChild>
              <label htmlFor="document-upload">
                <Upload className="mr-2 h-4 w-4" />
                Select Files
                <input id="document-upload" type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} className="hidden" />
              </label>
            </Button>
          </div>
        </div>

        {formData.documents.length > 0 && (
          <div className="space-y-2">
            <Label>Uploaded Documents</Label>
            <div className="space-y-2">
              {formData.documents.map((file, index) => (
                <div key={index} className="flex items-center justify-between rounded-lg border p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium">{file.name}</p>
                      <p className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveFile(index)}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Remove {file.name}</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2">
          <Label>Verification</Label>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="terms" checked={formData.terms} onCheckedChange={(checked) => handleInputChange("terms", !!checked)} />
              <Label htmlFor="terms" className="text-sm font-normal">
                I confirm that all information provided is accurate and complete
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="guidelines" checked={formData.guidelines} onCheckedChange={(checked) => handleInputChange("guidelines", !!checked)} />
              <Label htmlFor="guidelines" className="text-sm font-normal">
                I have read and agree to the Mentor Guidelines and Code of Conduct
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="interview" checked={formData.interview} onCheckedChange={(checked) => handleInputChange("interview", !!checked)} />
              <Label htmlFor="interview" className="text-sm font-normal">
                I understand that I may be contacted for an interview as part of the verification process
              </Label>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gray-100 p-4">
          <h3 className="font-medium mb-2">What happens next?</h3>
          <ol className="space-y-2 list-decimal list-inside text-sm text-gray-500">
            <li>Our admin team will review your application</li>
            <li>You may be contacted for additional information or an interview</li>
            <li>You'll receive a notification once your application is approved or rejected</li>
            <li>If approved, you'll gain access to the mentor dashboard and can start accepting sessions</li>
          </ol>
        </div>
      </div>
    </>
  );
}
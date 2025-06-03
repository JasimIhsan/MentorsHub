import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { MentorApplicationFormData } from "@/types/mentor.application";

interface PersonalInfoStepProps {
  formData: MentorApplicationFormData;
  handleInputChange: (field: keyof MentorApplicationFormData, value: any) => void;
  handleArrayChange: (field: keyof MentorApplicationFormData, value: string, checked: boolean) => void;
}

export function PersonalInfoStep({ formData, handleInputChange, handleArrayChange }: PersonalInfoStepProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first-name">First Name</Label>
          <Input id="first-name" value={formData.firstName} onChange={(e) => handleInputChange("firstName", e.target.value)} required />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last-name">Last Name</Label>
          <Input id="last-name" value={formData.lastName} onChange={(e) => handleInputChange("lastName", e.target.value)} required />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="professional-title">Professional Title</Label>
        <Input id="professional-title" value={formData.professionalTitle} onChange={(e) => handleInputChange("professionalTitle", e.target.value)} placeholder="e.g. Senior Software Engineer" required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Professional Bio</Label>
        <Textarea
          id="bio"
          value={formData.bio}
          onChange={(e) => handleInputChange("bio", e.target.value)}
          placeholder="Tell us about yourself, your expertise, and why you want to be a mentor..."
          className="min-h-[150px]"
          required
        />
        <p className="text-xs text-gray-500">This will be displayed on your mentor profile.</p>
      </div>

      <div className="space-y-2">
        <Label>Languages Spoken</Label>
        <div className="flex flex-wrap gap-4">
          {["English", "Malayalam", "Hindi", "French", "Spanish", "Tamil", "Telugu", "Kannada"].map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox id={`lang-${lang}`} checked={formData.languages.includes(lang)} onCheckedChange={(checked) => handleArrayChange("languages", lang, !!checked)} />
              <Label htmlFor={`lang-${lang}`} className="font-normal">
                {lang}
              </Label>
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-3">Select all languages you speak fluently.</p>
      </div>
    </>
  );
}
// SkillsInterestsSection.tsx
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MultipleSelector from "@/components/ui/multiple-selector";
import { BookOpen } from "lucide-react";
import { SKILL_OPTIONS } from "@/data/skill.option";
import { INTEREST_OPTIONS } from "@/data/interest.option";
import { UpdateProfileFormData } from "@/schema/updateProfilePersonalInfo";

interface SkillsInterestsSectionProps {
  formData: UpdateProfileFormData;
  isEditing: boolean;
  handleInputChange: (field: keyof UpdateProfileFormData, value: any) => void;
  errors: Record<keyof UpdateProfileFormData, string>; // Add errors prop
}

export function SkillsInterestsSection({ formData, isEditing, handleInputChange, errors }: SkillsInterestsSectionProps) {
  const handleSkillsChange = (options: { label: string; value: string }[]) => {
    const uniqueSkills = Array.from(new Set(options.map((opt) => opt.label)));
    handleInputChange("skills", uniqueSkills);
  };

  const handleInterestsChange = (options: { label: string; value: string }[]) => {
    const uniqueInterests = Array.from(new Set(options.map((opt) => opt.label)));
    handleInputChange("interests", uniqueInterests);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skills & Interests</CardTitle>
        <CardDescription>Showcase your skills and learning goals</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <h3 className="mb-2 font-medium">My Skills</h3>
            {!isEditing && formData.skills.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.skills.map((skill) => (
                  <Badge key={skill}>{skill}</Badge>
                ))}
              </div>
            ) : formData.skills.length === 0 ? (
              <div className="text-muted-foreground flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4" />
                <p>No skills added yet. {isEditing ? "Add some below!" : "Edit to share your skills!"}</p>
              </div>
            ) : null}
            {isEditing && (
              <MultipleSelector
                value={formData.skills.map((skill) => ({ label: skill, value: skill.toLowerCase() }))}
                onChange={handleSkillsChange}
                defaultOptions={SKILL_OPTIONS}
                placeholder="Select or type skills..."
                creatable
                emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching skills found.</p>}
                className="w-full"
              />
            )}
            {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
          </div>
          <div>
            <h3 className="mb-2 font-medium">Learning Interests</h3>
            {!isEditing && formData.interests.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-4">
                {formData.interests.map((interest) => (
                  <Badge>{interest}</Badge>
                ))}
              </div>
            ) : formData.interests.length === 0 ? (
              <div className="text-muted-foreground flex items-center gap-2 mb-4">
                <BookOpen className="h-4 w-4" />
                <p>No interests added yet. {isEditing ? "Add some below!" : "Edit to share your interests!"}</p>
              </div>
            ) : null}
            {isEditing && (
              <MultipleSelector
                value={formData.interests.map((interest) => ({ label: interest, value: interest.toLowerCase() }))}
                onChange={handleInterestsChange}
                defaultOptions={INTEREST_OPTIONS}
                placeholder="Select or type interests..."
                creatable
                emptyIndicator={<p className="text-center text-sm text-muted-foreground">No matching interests found.</p>}
                className="w-full"
              />
            )}
            {errors.interests && <p className="text-red-500 text-sm">{errors.interests}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
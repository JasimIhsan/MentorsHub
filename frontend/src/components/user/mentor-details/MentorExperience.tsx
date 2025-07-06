import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { IMentorDTO } from "@/interfaces/IMentorDTO";

interface MentorExperienceProps {
  mentor: IMentorDTO;
}

export function MentorExperience({ mentor }: MentorExperienceProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Experience</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {mentor.workExperiences && mentor.workExperiences.length > 0 ? (
            mentor.workExperiences.map(
              (
                work: {
                  jobTitle: string;
                  company: string;
                  startDate: string;
                  endDate: string | null;
                  currentJob: boolean;
                  description: string;
                },
                index: number
              ) => (
                <div key={index} className="relative border-l-2 border-muted pl-6">
                  <div className={`absolute -left-[9px] top-1 h-4 w-4 rounded-full ${index === 0 ? "bg-primary" : "bg-muted"}`}></div>
                  <div>
                    <h3 className="font-bold">{work.jobTitle || "Unknown Position"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {work.company || "Unknown Company"} • {work.startDate || "N/A"} - {work.endDate || "Present"}
                    </p>
                    <p className="mt-2">{work.description || "No description provided"}</p>
                  </div>
                </div>
              )
            )
          ) : (
            <p className="text-muted-foreground">No work experience listed</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
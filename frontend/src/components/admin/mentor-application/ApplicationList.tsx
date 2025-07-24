import { IMentorDTO } from "@/interfaces/mentor.interface";
import ApplicationCard from "./ApplicationCard";
import { memo } from "react";

interface ApplicationListProps {
	applications: IMentorDTO[];
	updateMentorStatus: (userId: string, status: "approved" | "rejected", rejectionReason?: string) => void;
	isLoading: boolean;
	onViewDetails: (mentor: IMentorDTO) => void;
}

export const ApplicationList = memo(({ applications, updateMentorStatus, isLoading, onViewDetails }: ApplicationListProps) => {
	return (
		<div className="space-y-4">
			{isLoading ? (
				<div className="space-y-4">
					{Array(5)
						.fill(0)
						.map((_, index) => (
							<div key={index} className="border rounded-lg p-4 bg-white shadow-sm animate-pulse">
								<div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
								<div className="space-y-2">
									<div className="h-4 bg-gray-200 rounded w-2/3"></div>
									<div className="h-4 bg-gray-200 rounded w-1/2"></div>
								</div>
								<div className="mt-4 flex gap-2">
									<div className="h-7 bg-gray-200 rounded w-24"></div>
									<div className="h-7 bg-gray-200 rounded w-24"></div>
								</div>
							</div>
						))}
				</div>
			) : applications.length === 0 ? (
				<p className="text-center text-muted-foreground">No applications found.</p>
			) : (
				applications.map((application) => <ApplicationCard key={application.userId} application={application} updateMentorStatus={updateMentorStatus} onViewDetails={onViewDetails} />)
			)}
		</div>
	);
});

export interface IReportDTO {
	id: string;
	reporter: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
	};
	reported: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
		status: "blocked" | "unblocked";
	};
	reason: string;
	status: "pending" | "dismissed" | "action_taken";
	adminNote?: string;
	createdAt: Date;
}

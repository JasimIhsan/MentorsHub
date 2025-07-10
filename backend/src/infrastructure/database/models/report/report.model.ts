import mongoose, { Document } from "mongoose";
import { ReportStatusEnum } from "../../../../application/interfaces/enums/report.status.enum";

export interface IReportDocument extends Document {
	_id: mongoose.Types.ObjectId;
	reporterId: mongoose.Types.ObjectId;
	reportedId: mongoose.Types.ObjectId;
	reason: string;
	status: ReportStatusEnum;
	adminNote: string;
	createdAt: Date;
	updatedAt: Date;
}

const ReportSchema = new mongoose.Schema(
	{
		reporterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		reportedId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
		reason: { type: String, required: true },
		status: {
			type: String,
			enum: ["pending", "dismissed", "action_taken"],
			default: "pending",
		},
		adminNote: { type: String },
	},
	{
		timestamps: true,
	},
);

export const ReportModel = mongoose.model<IReportDocument>("Report", ReportSchema);

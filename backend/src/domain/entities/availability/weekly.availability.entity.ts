import { IWeeklyAvailabilityDocument } from "../../../infrastructure/database/models/availability/weekly.availability.model";

export interface IWeeklyAvailabilityEntityProps {
	id: string;
	mentorId: string;
	dayOfWeek: number;
	startTime: string;
	endTime: string;
	isActive: boolean;
	createdAt: Date;
	updatedAt: Date;
}

export class WeeklyAvailabilityEntity {
	constructor(private props: IWeeklyAvailabilityEntityProps) {
		if (!props.startTime.match(/^\d{2}:\d{2}$/)) {
			throw new Error("Invalid start time format");
		}
		if (!props.endTime.match(/^\d{2}:\d{2}$/)) {
			throw new Error("Invalid end time format");
		}
		if (props.dayOfWeek < 0 || props.dayOfWeek > 6) {
			throw new Error("dayOfWeek must be between 0 (Sunday) and 6 (Saturday)");
		}
	}

	get id() {
		return this.props.id;
	}
	get mentorId() {
		return this.props.mentorId;
	}
	get dayOfWeek() {
		return this.props.dayOfWeek;
	}
	get startTime() {
		return this.props.startTime;
	}
	get endTime() {
		return this.props.endTime;
	}
	get isActive() {
		return this.props.isActive;
	}
	get createdAt() {
		return this.props.createdAt;
	}
	get updatedAt() {
		return this.props.updatedAt;
	}

	isActiveForDay(day: number): boolean {
		return this.isActive && this.dayOfWeek === day;
	}

	static fromDbDocument(doc: IWeeklyAvailabilityDocument) {
		return new WeeklyAvailabilityEntity({
			id: doc.id.toString(),
			mentorId: doc.mentorId.toString(),
			dayOfWeek: doc.dayOfWeek,
			startTime: doc.startTime,
			endTime: doc.endTime,
			isActive: doc.isActive,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}

	static toObject(availability: WeeklyAvailabilityEntity) {
		return {
			id: availability.id,
			mentorId: availability.mentorId,
			dayOfWeek: availability.dayOfWeek,
			startTime: availability.startTime,
			endTime: availability.endTime,
			isActive: availability.isActive,
			createdAt: availability.createdAt,
			updatedAt: availability.updatedAt,
		};
	}
}

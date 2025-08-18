<<<<<<< HEAD
import { ISpecialAvailabilityDocument } from "../../../infrastructure/database/models/availability/special.availability.model";

export interface ISpecialAvailabilityProps {
	id: string;
	mentorId: string;
	date: Date;
	startTime: string;
	endTime: string;
	createdAt: Date;
	updatedAt: Date;
}

export class SpecialAvailabilityEntity {
	constructor(private props: ISpecialAvailabilityProps) {
		if (!props.startTime.match(/^\d{2}:\d{2}$/)) {
			throw new Error("Invalid start time format");
		}
		if (!props.endTime.match(/^\d{2}:\d{2}$/)) {
			throw new Error("Invalid end time format");
		}
		// if (props.date < new Date()) {
		// 	throw new Error("Date must be in the future");
		// }
	}

	get id(): string {
		return this.props.id;
	}
	get mentorId(): string {
		return this.props.mentorId;
	}
	get date(): Date {
		return this.props.date;
	}
	get startTime(): string {
		return this.props.startTime;
	}
	get endTime(): string {
		return this.props.endTime;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	set mentorId(mentorId: string) {
		this.props.mentorId = mentorId;
		this.touch();
	}

	set date(date: Date) {
		this.props.date = date;
		this.touch();
	}

	set startTime(startTime: string) {
		this.props.startTime = startTime;
		this.touch();
	}

	set endTime(endTime: string) {
		this.props.endTime = endTime;
		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static fromDbDocument(doc: ISpecialAvailabilityDocument) {
		return new SpecialAvailabilityEntity({
			id: doc._id.toString(),
			mentorId: doc.mentorId.toString(),
			date: doc.date,
			startTime: doc.startTime,
			endTime: doc.endTime,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}

	static toObject(availability: SpecialAvailabilityEntity) {
		return {
			id: availability.id,
			mentorId: availability.mentorId,
			date: availability.date,
			startTime: availability.startTime,
			endTime: availability.endTime,
			createdAt: availability.createdAt,
			updatedAt: availability.updatedAt,
		};
	}
}
=======
import { ISpecialAvailabilityDocument } from "../../../infrastructure/database/models/availability/special.availability.model";

export interface ISpecialAvailabilityProps {
	id: string;
	mentorId: string;
	date: Date;
	startTime: string;
	endTime: string;
	createdAt: Date;
	updatedAt: Date;
}

export class SpecialAvailabilityEntity {
	constructor(private props: ISpecialAvailabilityProps) {
		if (!props.startTime.match(/^\d{2}:\d{2}$/)) {
			throw new Error("Invalid start time format");
		}
		if (!props.endTime.match(/^\d{2}:\d{2}$/)) {
			throw new Error("Invalid end time format");
		}
		// if (props.date < new Date()) {
		// 	throw new Error("Date must be in the future");
		// }
	}

	get id(): string {
		return this.props.id;
	}
	get mentorId(): string {
		return this.props.mentorId;
	}
	get date(): Date {
		return this.props.date;
	}
	get startTime(): string {
		return this.props.startTime;
	}
	get endTime(): string {
		return this.props.endTime;
	}
	get createdAt(): Date {
		return this.props.createdAt;
	}
	get updatedAt(): Date {
		return this.props.updatedAt;
	}

	set mentorId(mentorId: string) {
		this.props.mentorId = mentorId;
		this.touch();
	}

	set date(date: Date) {
		this.props.date = date;
		this.touch();
	}

	set startTime(startTime: string) {
		this.props.startTime = startTime;
		this.touch();
	}

	set endTime(endTime: string) {
		this.props.endTime = endTime;
		this.touch();
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	static fromDbDocument(doc: ISpecialAvailabilityDocument) {
		return new SpecialAvailabilityEntity({
			id: doc._id.toString(),
			mentorId: doc.mentorId.toString(),
			date: doc.date,
			startTime: doc.startTime,
			endTime: doc.endTime,
			createdAt: doc.createdAt,
			updatedAt: doc.updatedAt,
		});
	}

	static toObject(availability: SpecialAvailabilityEntity) {
		return {
			id: availability.id,
			mentorId: availability.mentorId,
			date: availability.date,
			startTime: availability.startTime,
			endTime: availability.endTime,
			createdAt: availability.createdAt,
			updatedAt: availability.updatedAt,
		};
	}
}
>>>>>>> refractor/code-cleanup

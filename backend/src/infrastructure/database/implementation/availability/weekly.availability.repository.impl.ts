import { WeeklyAvailabilityEntity } from "../../../../domain/entities/availability/weekly.availability.entity";
import { IWeeklyAvailabilityRepository } from "../../../../domain/repositories/availability/weekly.availability.repository";
import { handleExceptionError } from "../../../utils/handle.exception.error";
import { WeeklyAvailabilityModel } from "../../models/availability/weekly.availability.model";

export class WeeklyAvailabilityRepositoryImpl implements IWeeklyAvailabilityRepository {
	async create(entity: WeeklyAvailabilityEntity): Promise<WeeklyAvailabilityEntity> {
		try {
			const slot = await WeeklyAvailabilityModel.create(WeeklyAvailabilityEntity.toObject(entity));
			return WeeklyAvailabilityEntity.fromDbDocument(slot);
		} catch (error) {
			return handleExceptionError(error, "Error adding availability slot");
		}
	}

	async findById(id: string): Promise<WeeklyAvailabilityEntity | null> {
		try {
			const doc = await WeeklyAvailabilityModel.findById(id);
			return doc ? WeeklyAvailabilityEntity.fromDbDocument(doc) : null;
		} catch (error) {
			return handleExceptionError(error, "Error finding availability slot by ID");
		}
	}

	async delete(id: string): Promise<void> {
		try {
			await WeeklyAvailabilityModel.findByIdAndDelete(id);
		} catch (error) {
			handleExceptionError(error, "Error deleting availability slot");
		}
	}

	async update(entity: WeeklyAvailabilityEntity): Promise<void> {
		try {
			await WeeklyAvailabilityModel.findByIdAndUpdate(entity.id, WeeklyAvailabilityEntity.toObject(entity));
		} catch (error) {
			handleExceptionError(error, "Error updating availability slot");
		}
	}

	async isExists(mentorId: string, dayOfWeek: number, startTime: string, endTime: string): Promise<boolean> {
		try {
			const exists = await WeeklyAvailabilityModel.exists({
				mentorId,
				dayOfWeek,
				$or: [
					// 1. New startTime is in existing slot
					{
						startTime: { $lte: startTime },
						endTime: { $gt: startTime },
					},
					// 2. New endTime is in existing slot
					{
						startTime: { $lt: endTime },
						endTime: { $gte: endTime },
					},
					// 3. New slot fully overlaps existing
					{
						startTime: { $gte: startTime },
						endTime: { $lte: endTime },
					},
				],
			});
			return !!exists;
		} catch (error) {
			handleExceptionError(error, "Error checking overlapping availability slots");
			return false;
		}
	}

	async findAllByMentorId(mentorId: string): Promise<WeeklyAvailabilityEntity[]> {
		try {
			const docs = await WeeklyAvailabilityModel.find({ mentorId });
			return docs.map(WeeklyAvailabilityEntity.fromDbDocument);
		} catch (error) {
			return handleExceptionError(error, "Error finding availability slots by mentor ID");
		}
	}

	async toggleAvailabilityByWeekDay(mentorId: string, dayOfWeek: number, status: boolean): Promise<void> {
		try {
			await WeeklyAvailabilityModel.updateMany({ mentorId, dayOfWeek }, { $set: { isActive: status } });
		} catch (error) {
			handleExceptionError(error, "Error toggling availability by week day");
		}
	}

	async findAvailableSlots(mentorId: string, date: Date, durationInHours: number): Promise<string[] | null> {
		console.log("📅 date in impl: ", date);
		try {
			const targetDay = new Date(date).getDay(); // 0 = Sunday, 6 = Saturday

			// Fetch all active weekly slots for that day
			const slots = await WeeklyAvailabilityModel.find({
				mentorId,
				dayOfWeek: targetDay,
				isActive: true,
			}).sort({ startTime: 1 });

			if (!slots.length) return null;

			const timeToMinutes = (timeStr: string) => {
				const [h, m] = timeStr.split(":").map(Number);
				return h * 60 + m;
			};

			const minutesToTime = (minutes: number) => {
				const h = Math.floor(minutes / 60);
				const m = minutes % 60;
				return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
			};

			const availableSlots: string[] = [];

			for (let i = 0; i <= slots.length - durationInHours; i++) {
				let isConsecutive = true;
				let expectedStart = timeToMinutes(slots[i].startTime);

				for (let j = 0; j < durationInHours; j++) {
					const slot = slots[i + j];
					const slotStart = timeToMinutes(slot.startTime);
					const slotEnd = timeToMinutes(slot.endTime);

					if (slotStart !== expectedStart || slotEnd - slotStart !== 60) {
						isConsecutive = false;
						break;
					}

					expectedStart += 60;
				}

				if (isConsecutive) {
					availableSlots.push(slots[i].startTime);
				}
			}

			return availableSlots.length ? availableSlots : null;
		} catch (error) {
			handleExceptionError(error, "Error finding available weekly slots");
			return null;
		}
	}
}

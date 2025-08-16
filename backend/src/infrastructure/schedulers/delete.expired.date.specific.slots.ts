import cron from "node-cron";
import { SpecialAvailabilityModel } from "../database/models/availability/special.availability.model";
import { specialAvailabilityRepository } from "../composer";

// Helper: convert date + endTime string into a real Date
function getSlotEndDate(slotDate: Date, endTime: string): Date {
	const [hours, minutes] = endTime.split(":").map(Number);
	const endDateTime = new Date(slotDate);
	endDateTime.setHours(hours, minutes, 0, 0);
	return endDateTime;
}

// Cron job: runs daily at 00:05
// "5 0 * * *"

export const startSlotCleanupJob = () => {
	console.log("🔵 Cron Job: Delete Expired Special Slot Job Initialized");

	cron.schedule("* * * * *", async () => {
		try {
			console.log("🔵 Cleaning up expired mentor slots...");

			const now = new Date();
			const slots = await specialAvailabilityRepository.find();

			for (const slot of slots) {
				const slotEnd = getSlotEndDate(slot.date, slot.endTime);

				if (slotEnd < now) {
					await SpecialAvailabilityModel.deleteOne({ _id: slot.id });
					console.log(`🔵 Deleted expired slot: ${slot.id}`);
				}
			}

			console.log("🔵 Expired slot cleanup completed.");
		} catch (err) {
			console.error("[CRON ERROR]", err);
		}
	});
};

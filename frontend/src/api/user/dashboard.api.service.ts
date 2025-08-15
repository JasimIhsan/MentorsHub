import { fetchAllApprovedMentors } from "../mentors.api.service";
import { fetchSessionsByUser } from "../session.api.service";

export const fetchDashboardDatas = async (userId: string) => {
	try {
		const [sessionsRes, mentorRes] = await Promise.all([fetchSessionsByUser(userId, 1, 3, "upcoming"), fetchAllApprovedMentors(userId, 1, 1, "", "recommended")]);
		return { sessions: sessionsRes.sessions, mentor: mentorRes.mentors };
	} catch (error) {
		console.error("Error fetching data:", error);
		if (error instanceof Error) {
			throw new Error("Failed to fetch dashboard data");
		}
	}
};

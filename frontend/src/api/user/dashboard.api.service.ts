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

// fakeDashboardApi.ts

// export const fetchDashboardDatas = async () => {
// 	try {
// 		// Simulate network delay
// 		await new Promise((resolve) => setTimeout(resolve, 1000));

// 		const sessions: Session[] = [
// 			{
// 				id: 1,
// 				title: "Intro to MERN Stack",
// 				mentorName: "Alice Johnson",
// 				mentorAvatar: "https://example.com/avatar/alice.jpg",
// 				date: "2025-05-10",
// 				time: "10:00 AM",
// 				type: "video",
// 				isPaid: true,
// 			},
// 			{
// 				id: 2,
// 				title: "Debugging React Apps",
// 				mentorName: "Bob Smith",
// 				mentorAvatar: "https://example.com/avatar/bob.jpg",
// 				date: "2025-05-12",
// 				time: "2:00 PM",
// 				type: "chat",
// 				isPaid: false,
// 			},
// 		];

// 		const notifications: Notification[] = [
// 			{
// 				id: 1,
// 				message: "Your session with Alice is tomorrow at 10:00 AM.",
// 				action: "View session",
// 				time: "24 hours left",
// 				type: "reminder",
// 			},
// 		];

// 		const mentors: Mentor[] = [
// 			{
// 				id: 1,
// 				name: "Alice Johnson",
// 				expertise: "MERN Stack",
// 				avatar: "https://example.com/avatar/alice.jpg",
// 				isPaid: true,
// 				tags: ["React", "Node.js", "MongoDB"],
// 				rate: "$40/hour",
// 			},
// 		];

// 		return {
// 			sessions,
// 			notifications,
// 			mentors,
// 		};
// 	} catch (error) {
// 		console.error("Error fetching dummy dashboard data:", error);
// 		throw new Error("Failed to fetch dummy dashboard data");
// 	}
// };

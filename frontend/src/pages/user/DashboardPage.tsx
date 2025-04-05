import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { UserInterface, Session, Notification, Mentor } from "@/interfaces/interfaces";
import { RootState } from "@/store/store";
import axiosInstance from "@/api/api.config";
import WelcomeHeader from "@/components/user/Dashboard/WelcomeSection";
import GamificationCard from "@/components/user/Dashboard/GamificationCard";
import UpcomingSessions from "@/components/user/Dashboard/UpcomingSessions";
import Notifications from "@/components/user/Dashboard/Notifications";
import QuickLinks from "@/components/user/Dashboard/QuickLinks";
import MentorsReadyNow from "@/components/user/Dashboard/MentorsReadyNow";
import { fetchDashboardDatas } from "@/api/user/dashboard.services";
import { toast } from "sonner";

export const DashboardPage: React.FC = () => {
	const user = useSelector((state: RootState) => state.auth.user) as UserInterface | null;
	const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const [readyNowMentors, setReadyNowMentors] = useState<Mentor[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const data = await fetchDashboardDatas();
				if (data) {
					setUpcomingSessions(data.sessions);
					setNotifications(data.notifications);
					setReadyNowMentors(data.mentors);
				}
			} catch (error) {
				console.error("Error fetching dashboard data:", error);
				if (error instanceof Error) {
					toast.error(error.message);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, []);

	if (!user) {
		return null;
	}

	const test = async () => {
		const response = await axiosInstance.get("/test");
		console.log(response);
		toast.success(response.data.message)
	};

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="w-full pb-6">
			<div className="flex flex-col gap-8">
				<WelcomeHeader user={user} />
				<section className="flex flex-col gap-4 px-10 md:px-20 xl:px-25 justify-center">
					<GamificationCard onTestClick={test} />
					<UpcomingSessions sessions={upcomingSessions} />
					<Notifications notifications={notifications} />
				</section>
				<div className="grid gap-6 md:grid-cols-2 px-10 md:px-20 xl:px-25 justify-center">
					<QuickLinks />
					<MentorsReadyNow mentors={readyNowMentors} />
				</div>
			</div>
		</div>
	);
};

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { UserInterface } from "@/interfaces/interfaces";
import { AppDispatch, RootState } from "@/store/store";
import axiosInstance from "@/api/config/api.config";
import WelcomeHeader from "@/components/user/Dashboard/WelcomeSection";
import GamificationCard from "@/components/user/Dashboard/GamificationCard";
import UpcomingSessions from "@/components/user/Dashboard/UpcomingSessions";
import Notifications from "@/components/user/Dashboard/Notifications";
import QuickLinks from "@/components/user/Dashboard/QuickLinks";
import { fetchDashboardDatas } from "@/api/user/dashboard.api.service";
import { toast } from "sonner";
import { fetchUserProfile } from "@/store/slices/userSlice";
import { markAllNotificationsAsReadThunk, markNotificationAsReadThunk } from "@/store/slices/notificationSlice";
import { ISessionUserDTO } from "@/interfaces/ISessionDTO";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import TopRatedMentors from "@/components/user/Dashboard/MentorsReadyNow";

export const DashboardPage: React.FC = () => {
	const user = useSelector((state: RootState) => state.userAuth.user) as UserInterface | null;
	const [upcomingSessions, setUpcomingSessions] = useState<ISessionUserDTO[]>([]);
	const [topRatedMentor, setTopRatedMentor] = useState<IMentorDTO[]>([]);
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useDispatch<AppDispatch>();
	const { notifications, isLoading } = useSelector((state: RootState) => state.notifications);

	useEffect(() => {
		dispatch(fetchUserProfile());
	}, [dispatch]);

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true);
			try {
				const data = await fetchDashboardDatas(user?.id!);
				console.log("data: ", data);
				if (data) {
					setUpcomingSessions(data.sessions);
					setTopRatedMentor(data.mentor);
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
		try {
			const response = await axiosInstance.get("/user/test");
			console.log("test response : ", response);
			toast.success(response.data.message);
		} catch (error: any) {
			toast.error(error.response.data.message);
		}
	};

	const markAsRead = async (notificationId: string) => {
		dispatch(markNotificationAsReadThunk(notificationId));
	};

	const markAllAsRead = async (userId: string) => {
		dispatch(markAllNotificationsAsReadThunk(userId));
	};

	return (
		<div className="w-full pb-6">
			<div className="flex flex-col gap-8">
				<WelcomeHeader user={user} />
				<section className="flex flex-col gap-4 px-10 md:px-20 xl:px-25">
					<GamificationCard onTestClick={test} />
					<UpcomingSessions isLoading={loading} sessions={upcomingSessions} />
					<Notifications isLoading={isLoading} notifications={notifications} markAsRead={markAsRead} markAllAsRead={markAllAsRead} userId={user.id as string} />
				</section>
				<div className="grid gap-6 w-full px-10 md:px-20 xl:px-25">
					<div className="grid gap-6 w-full lg:grid-cols-2">
						<TopRatedMentors mentors={topRatedMentor} isLoading={loading} />
						<QuickLinks />
					</div>
				</div>
			</div>
		</div>
	);
};

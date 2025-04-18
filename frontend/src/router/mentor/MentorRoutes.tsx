import { Routes, Route } from "react-router-dom";
// import MainLayout from "@/layouts/UserLayout";
import PageNotFound from "@/pages/user/PageNotFoundPage";
import { MentorDashboardPage } from "@/pages/mentor/MentorDashboardPage";
import { MentorLayout } from "@/layouts/MentorLayout";
import { MentorProtectedRoute } from "./ProtectedRoute";
import { MentorRequestsPage } from "@/pages/mentor/MentorRequestPage";
import { MentorCalendarPage } from "@/pages/mentor/MentorCalendarPage";
import { MentorAvailabilityPage } from "@/pages/mentor/MentorAvailabilityPage";

const MentorRoutes = () => {
	return (
		<Routes>
			<Route element={<MentorLayout />}>
				<Route
					path="dashboard"
					element={
						<MentorProtectedRoute>
							<MentorDashboardPage />
						</MentorProtectedRoute>
					}
				/>
				<Route
					path="requests"
					element={
						<MentorProtectedRoute>
							<MentorRequestsPage />
						</MentorProtectedRoute>
					}
				/>
				<Route
					path="calendar"
					element={
						<MentorProtectedRoute>
							<MentorCalendarPage />
						</MentorProtectedRoute>
					}
				/>
				<Route
					path="availability"
					element={
						<MentorProtectedRoute>
							<MentorAvailabilityPage />
						</MentorProtectedRoute>
					}
				/>
				<Route path="*" element={<PageNotFound />} />
			</Route>
		</Routes>
	);
};

export default MentorRoutes;

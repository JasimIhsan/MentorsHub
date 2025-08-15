import { Routes, Route } from "react-router-dom";
// import MainLayout from "@/layouts/UserLayout";
import { MentorDashboardPage } from "@/pages/mentor/MentorDashboardPage";
import { MentorLayout } from "@/layouts/MentorLayout";
import { MentorProtectedRoute } from "./ProtectedRoute";
import { MentorRequestsPage } from "@/pages/mentor/MentorRequestPage";
import { MentorCalendarPage } from "@/pages/mentor/MentorCalendarPage";
import { MentorAvailabilityPage } from "@/pages/mentor/MentorAvailabilityPage";
import { MentorUpcomingSessionsPage } from "@/pages/mentor/MentorUpcomingSessionPage";
import { MentorSessionHistoryPage } from "@/pages/mentor/MentorSessionHistoryPage";
import { MentorPageNotFoundPage } from "@/pages/mentor/MentorPageNotFoundPage";
import { MentorProfilePage } from "@/pages/mentor/MentorProfilePage";
import { MentorReviewsPage } from "@/pages/mentor/MentorReviewPage";
import { MentorRescheduleRequestsPage } from "@/pages/mentor/MentorSessionRescheduleRequestPage";
import { SessionDetailsPage } from "@/pages/common/SessionDetailsPage";

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

				<Route
					path="session-history"
					element={
						<MentorProtectedRoute>
							<MentorSessionHistoryPage />
						</MentorProtectedRoute>
					}
				/>

				<Route
					path="upcoming-sessions"
					element={
						<MentorProtectedRoute>
							<MentorUpcomingSessionsPage />
						</MentorProtectedRoute>
					}
				/>

				<Route
					path="session-details/:sessionId"
					element={
						<MentorProtectedRoute>
							<SessionDetailsPage />
						</MentorProtectedRoute>
					}
				/>

				<Route
					path="reschedule-requests"
					element={
						<MentorProtectedRoute>
							<MentorRescheduleRequestsPage />
						</MentorProtectedRoute>
					}
				/>

				<Route
					path="profile"
					element={
						<MentorProtectedRoute>
							<MentorProfilePage />
						</MentorProtectedRoute>
					}
				/>

				<Route
					path="reviews"
					element={
						<MentorProtectedRoute>
							<MentorReviewsPage />
						</MentorProtectedRoute>
					}
				/>

				<Route path="*" element={<MentorPageNotFoundPage />} />
			</Route>
		</Routes>
	);
};

export default MentorRoutes;

import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/UserLayout";
import PageNotFound from "@/pages/user/PageNotFound";
import { MentorProtectedRoute } from "./ProtectedRoute";
import MentorDashboardPage from "@/pages/mentor/MentorDashboardPage";

const MentorRoutes = () => {
	return (
		<Routes>
				<Route
					path="dashboard"
					element={
						<MentorProtectedRoute>
							<MentorDashboardPage />
						</MentorProtectedRoute>
					}
				/>
				<Route path="*" element={<PageNotFound />} />
		</Routes>
	);
};

export default MentorRoutes;

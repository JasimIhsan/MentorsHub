import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/UserLayout";
import Home from "@/pages/user/HomePage";
import Authentication from "@/pages/user/AuthenticationPage";
import ResetPasswordPage from "@/pages/user/ResetPasswordPage";
import PageNotFound from "@/pages/user/PageNotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthGuard } from "./AuthGuard";
import { DashboardPage } from "@/pages/user/DashboardPage";
import UserProfilePage from "@/pages/user/UserProfilePage";
import BrowseMentorsPage from "@/pages/user/BrowseMentorsPage";
import { BecomeMentorPage } from "@/pages/user/BecomeMentorPage";
import { MentorProfilePage } from "@/pages/user/MentorProfilePage";

const UserRoutes = () => {
	return (
		<Routes>
			<Route
				path="authenticate"
				element={
					<AuthGuard>
						<Authentication />
					</AuthGuard>
				}
			/>
			<Route path="reset-password/:token" element={<ResetPasswordPage />} />
			<Route element={<MainLayout />}>
				<Route path="/" element={<Home />} />
				<Route
					path="dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<UserProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/browse"
					element={
						<ProtectedRoute>
							<BrowseMentorsPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/browse/mentor-profile/:mentorId"
					element={
						<ProtectedRoute>
							<MentorProfilePage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/become-mentor"
					element={
						<ProtectedRoute>
							<BecomeMentorPage />
						</ProtectedRoute>
					}
				/>
				<Route path="*" element={<PageNotFound />} />
			</Route>
		</Routes>
	);
};

export default UserRoutes;

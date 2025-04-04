import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/UserLayout";
import Home from "@/pages/user/Home";
import Authentication from "@/pages/user/Authentication";
import ResetPasswordPage from "@/pages/user/ResetPasswordPage";
import PageNotFound from "@/pages/user/PageNotFound";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthGuard } from "./AuthGuard";
import { DashboardPage } from "@/pages/user/DashboardPage";

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
				<Route path="*" element={<PageNotFound />} />
			</Route>
		</Routes>
	);
};

export default UserRoutes;

import { Routes, Route } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayouts"; // Adjust the import path as needed
import AdminDashboard from "@/pages/admin/AdminDashboard"; // Adjust the import path as needed
import { AdminProtectedRoute } from "./AdminProtectedRoute"; // Adjust the import path as needed
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminPageNotFound from "@/pages/admin/AdminPageNotFound";
import AdminUsersTab from "@/pages/admin/AdminUsersTab";
import { AdminAuthGuard } from "./AdminAuthGuard";
import { AdminMentorApplicationsPage } from "@/pages/admin/AdminMentorRequestApplication";
import { AdminWalletPage } from "@/pages/admin/AdminWalletPage";
import AdminGamificationPage from "@/pages/admin/AdminGamificationPage";
import { AdminReportsPage } from "@/pages/admin/AdminReportsPage";

const AdminRoutes = () => {
	return (
		<Routes>
			{/* All admin routes will be wrapped by AdminLayout */}
			<Route
				path="/login"
				element={
					<AdminAuthGuard>
						<AdminLoginPage />
					</AdminAuthGuard>
				}
			/>

			<Route element={<AdminLayout />}>
				<Route
					path="dashboard"
					element={
						<AdminProtectedRoute>
							<AdminDashboard />
						</AdminProtectedRoute>
					}
				/>
				{/* Add more nested admin routes here as needed */}
				<Route
					path="users"
					element={
						<AdminProtectedRoute>
							<AdminUsersTab />
						</AdminProtectedRoute>
					}
				/>
				<Route
					path="mentor-applications"
					element={
						<AdminProtectedRoute>
							<AdminMentorApplicationsPage />
						</AdminProtectedRoute>
					}
				/>

				<Route
					path="payments"
					element={
						<AdminProtectedRoute>
							<AdminWalletPage />
						</AdminProtectedRoute>
					}
				/>

				<Route
					path="gamification"
					element={
						<AdminProtectedRoute>
							<AdminGamificationPage />
						</AdminProtectedRoute>
					}
				/>

				<Route
					path="reports"
					element={
						<AdminProtectedRoute>
							<AdminReportsPage />
						</AdminProtectedRoute>
					}
				/>
				{/* <Route path="mentors" element={<AdminProtectedRoute><ManageMentors /></AdminProtectedRoute>} /> */}
				<Route path="*" element={<AdminPageNotFound />} />
			</Route>
		</Routes>
	);
};

export default AdminRoutes;

import { Routes, Route } from "react-router-dom";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import { AdminAuthGuard } from "./AdminAuthGuard";
import { AdminProtectedRoute } from "./AdminProtectedRoute";
import AdminLayout from "@/layouts/AdminLayouts"; // Ensure this matches your file path

const AdminRoutes = () => {
	return (
		<Routes>
			<Route
				path="login"
				element={
					<AdminAuthGuard>
						<AdminLoginPage />
					</AdminAuthGuard>
				}
			/>
			<Route
				path="/"
				element={
					<AdminProtectedRoute>
						<AdminLayout />
					</AdminProtectedRoute>
				}>
				<Route index element={<AdminDashboard />} /> {/* /admin */}
				<Route path="dashboard" element={<AdminDashboard />} /> {/* /admin/dashboard */}
				{/* Add more nested admin routes here as needed */}
				{/* <Route path="users" element={<ManageUsers />} /> */}
				{/* <Route path="mentors" element={<ManageMentors />} /> */}
			</Route>
		</Routes>
	);
};

export default AdminRoutes;

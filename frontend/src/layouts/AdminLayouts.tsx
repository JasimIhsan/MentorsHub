import { Outlet } from "react-router-dom"; // Import Outlet
import { Sidebar } from "@/components/admin/Sidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<AdminHeader />
			<div className="flex flex-1">
				<Sidebar />
				<main className="flex-1 overflow-y-auto bg-muted/20 p-6">
					<Outlet /> 
				</main>
			</div>
		</div>
	);
}

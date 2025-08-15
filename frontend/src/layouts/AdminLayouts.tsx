import { Outlet } from "react-router-dom";
import { Sidebar } from "@/components/admin/layouts/Sidebar";
import { AdminHeader } from "@/components/admin/layouts/AdminHeader";

export default function AdminLayout() {
	return (
		<div className="flex min-h-screen flex-col">
			<div className="fixed top-0 left-0 right-0 z-10">
				<AdminHeader />
			</div>
			<div className="flex flex-1 pt-[60px]">
				<div className=" lg:fixed lg:top-[65px] lg:bottom-0 lg:w-[240px] lg:z-10">
					<Sidebar className="h-full" />
				</div>
				<main className="flex-1 lg:ml-[240px] overflow-y-auto bg-muted/20 p-6">
					<Outlet />
				</main>
			</div>
		</div>
	);
}

import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { deleteUserApi, fetchAllUsers, updateUseStatusApi } from "@/api/admin/user.tab";
import { toast } from "sonner";
import { IUserDTO } from "@/interfaces/IUserDTO";
import { UserFilter } from "@/components/admin/user-tab/UserFilters";
import { UserTable } from "@/components/admin/user-tab/UserTable";
import { UserPagination } from "@/components/admin/layouts/pagination";
import { AddUserForm } from "@/components/admin/user-tab/AddUserForm";
import { UserDetailsModal } from "@/components/admin/user-tab/UserDetailsModal";
import { useDebounce } from "@/hooks/useDebounce";

export default function AdminUsersTab() {
	const [searchParams, setSearchParams] = useSearchParams();
	const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
	const debouncedSearchTerm = useDebounce(searchTerm, 1000);
	const [roleFilter, setRoleFilter] = useState(searchParams.get("role") || "all");
	const [statusFilter, setStatusFilter] = useState(searchParams.get("status") || "all");
	const [users, setUsers] = useState<IUserDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(Number(searchParams.get("page")) || 1);
	const [totalPages, setTotalPages] = useState(1);
	const [totalUsers, setTotalUsers] = useState(0);
	const [selectedUser, setSelectedUser] = useState<IUserDTO | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	useEffect(() => {
		const params = new URLSearchParams();
		if (currentPage !== 1) params.set("page", currentPage.toString());
		if (debouncedSearchTerm) params.set("search", debouncedSearchTerm);
		if (roleFilter !== "all") params.set("role", roleFilter);
		if (statusFilter !== "all") params.set("status", statusFilter);
		setSearchParams(params, { replace: true });
	}, [currentPage, debouncedSearchTerm, roleFilter, statusFilter, setSearchParams]);

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true);
			try {
				const response = await fetchAllUsers({
					page: currentPage,
					limit: 10,
					search: debouncedSearchTerm || undefined,
					role: roleFilter !== "all" ? roleFilter : undefined,
					status: statusFilter !== "all" ? statusFilter : undefined,
				});
				if (response.success) {
					setUsers(response.users);
					setTotalPages(response.totalPages);
					setTotalUsers(response.totalUsers);
				}
			} catch (error) {
				console.error("Error fetching users: ", error);
				if (error instanceof Error) {
					toast.error(error.message);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, [currentPage, debouncedSearchTerm, roleFilter, statusFilter]);

	const handleStatusUpdate = async (userId: string) => {
		try {
			const response = await updateUseStatusApi(userId);
			if (response.success) {
				toast.success("User status updated successfully!");
				setUsers((prevUsers) => prevUsers.map((user) => (user.id === userId ? { ...user, status: response.user.status } : user)));
			} else {
				toast.error("Failed to update user status.");
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const handleUserDelete = async (userId: string) => {
		try {
			const response = await deleteUserApi(userId);
			if (response.success) {
				setUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
				setTotalUsers((prev) => prev - 1);
				toast.success(response.message);
				// Adjust pagination if the current page becomes empty
				if (users.length === 1 && currentPage > 1) {
					setCurrentPage((prev) => prev - 1);
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				toast.error(error.message);
			}
		}
	};

	const handleViewDetails = (user: IUserDTO) => {
		setSelectedUser(user);
		setIsModalOpen(true);
	};

	const handleCloseModal = () => {
		setIsModalOpen(false);
		setSelectedUser(null);
	};

	return (
		<div className="space-y-6">
			<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Users</h1>
					<p className="text-muted-foreground">Manage and monitor all users on the platform</p>
				</div>
				<AddUserForm setUsers={setUsers} />
			</div>
			<UserFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} roleFilter={roleFilter} setRoleFilter={setRoleFilter} statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
			<UserTable users={users} loading={loading} handleStatusUpdate={handleStatusUpdate} handleDeleteUser={handleUserDelete} handleViewDetails={handleViewDetails} />
			<UserPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} filteredUsersLength={totalUsers} paginatedUsersLength={users.length} loading={loading} />
			{isModalOpen && selectedUser && <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />}
		</div>
	);
}

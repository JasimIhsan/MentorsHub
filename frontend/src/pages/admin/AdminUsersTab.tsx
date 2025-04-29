import { useState, useEffect } from "react";
import { deleteUserApi, fetchAllUsers, updateUseStatusApi } from "@/api/admin/user.tab";
import { toast } from "sonner";
import { IUserDTO } from "@/interfaces/IUserDTO";
import { UserFilter } from "@/components/admin/user-tab/UserFilters";
import { UserTable } from "@/components/admin/user-tab/UserTable";
import { UserPagination } from "@/components/admin/pagination";
import { AddUserForm } from "@/components/admin/user-tab/AddUserForm";
import { UserDetailsModal } from "@/components/admin/user-tab/UserDetailsModal";

export default function AdminUsersTab() {
	const [searchTerm, setSearchTerm] = useState("");
	const [roleFilter, setRoleFilter] = useState<string>("all");
	const [statusFilter, setStatusFilter] = useState<string>("all");
	const [users, setUsers] = useState<IUserDTO[]>([]);
	const [loading, setLoading] = useState(true);
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [selectedUser, setSelectedUser] = useState<IUserDTO | null>(null);
	const [isModalOpen, setIsModalOpen] = useState(false);

	const filteredUsers = users.filter((user) => {
		const matchesSearch = user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || user.email.toLowerCase().includes(searchTerm.toLowerCase());
		const matchesRole = roleFilter === "all" || user.role === roleFilter;
		const matchesStatus = statusFilter === "all" || user.status === statusFilter;
		return matchesSearch && matchesRole && matchesStatus;
	});

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
	const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

	const handleStatusUpdate = async (userId: string) => {
		try {
			const response = await updateUseStatusApi(userId);
			if (response.success) {
				toast.success("User status updated successfully!");
				setUsers((prevUsers: IUserDTO[]) => {
					return prevUsers.map((user) => {
						if (user.id === userId) {
							return { ...user, status: response.user.status };
						}
						return user;
					});
				});
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
				setUsers((prevUsers) => {
					return prevUsers.filter((user) => {
						if (user.id !== userId) {
							return user;
						}
					});
				});
				toast.success(response.message);
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

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await fetchAllUsers();
				if (response.success) {
					setUsers(response.users);
				}
			} catch (error) {
				console.log("error fetch users: ", error);
				if (error instanceof Error) {
					toast.error(error.message);
				}
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

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

			<UserTable users={paginatedUsers} loading={loading} handleStatusUpdate={handleStatusUpdate} handleDeleteUser={handleUserDelete} handleViewDetails={handleViewDetails} />

			<UserPagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} filteredUsersLength={filteredUsers.length} paginatedUsersLength={paginatedUsers.length} loading={loading} />

			{isModalOpen && selectedUser && <UserDetailsModal user={selectedUser} onClose={handleCloseModal} />}
		</div>
	);
}

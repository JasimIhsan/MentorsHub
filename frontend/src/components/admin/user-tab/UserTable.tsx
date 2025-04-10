import { ArrowUpDown, MoreHorizontal, ShieldOff, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RoleBadge, StatusBadge } from "./UserBadges";
import { IUserDTO } from "@/interfaces/IUserDTO";
import { useState, useEffect } from "react";
import Alert from "@/components/custom-ui/alert";
import { EditUserForm } from "./EditUserForm";

interface UserTableProps {
	users: IUserDTO[];
	loading: boolean;
	handleStatusUpdate: (userId: string) => void;
	handleDeleteUser: (userId: string) => void;
}

export function UserTable({ users, loading, handleStatusUpdate, handleDeleteUser }: UserTableProps) {
	const [sortedUsers, setSortedUsers] = useState<IUserDTO[]>(users);
	const [sortAsc, setSortAsc] = useState(true);
	const [sortColumn, setSortColumn] = useState<"name" | "joinedDate">("name");
	const [previewUserId, setPreviewUserId] = useState<string | null>(null); // Track the user ID for preview

	const handleSort = (column: "name" | "joinedDate") => {
		const isSameColumn = sortColumn === column;
		const newSortAsc = isSameColumn ? !sortAsc : true;
		setSortAsc(newSortAsc);
		setSortColumn(column);

		const sorted = [...sortedUsers].sort((a, b) => {
			if (column === "name") {
				const nameA = a.fullName.toLowerCase();
				const nameB = b.fullName.toLowerCase();
				if (nameA < nameB) return newSortAsc ? -1 : 1;
				if (nameA > nameB) return newSortAsc ? 1 : -1;
				return 0;
			} else if (column === "joinedDate") {
				const dateA = new Date(a.createdAt);
				const dateB = new Date(b.createdAt);
				if (dateA < dateB) return newSortAsc ? -1 : 1;
				if (dateA > dateB) return newSortAsc ? 1 : -1;
				return 0;
			}
			return 0;
		});

		setSortedUsers(sorted);
	};

	useEffect(() => {
		setSortedUsers(users); // Update when users prop changes
	}, [users]);

	const updateUserInState = (updatedUser: IUserDTO) => {
		setSortedUsers((prevUsers) => prevUsers.map((user) => (user.id === updatedUser.id ? { ...user, ...updatedUser } : user)));
	};

	// Find the user whose preview is being shown
	const previewUser = sortedUsers.find((user) => user.id === previewUserId);

	return (
		<div className="rounded-md border px-3 py-1">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[250px]">
							<div className="flex items-center">
								Name
								<Button variant="ghost" size="sm" className="ml-1 h-8 p-0" onClick={() => handleSort("name")}>
									<ArrowUpDown className="h-4 w-4" />
								</Button>
							</div>
						</TableHead>
						<TableHead>Email</TableHead>
						<TableHead>Role</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Sessions Completed</TableHead>
						<TableHead>
							<div className="flex items-center">
								Join Date
								<Button variant="ghost" size="sm" className="ml-1 h-8 p-0" onClick={() => handleSort("joinedDate")}>
									<ArrowUpDown className="h-4 w-4" />
								</Button>
							</div>
						</TableHead>
						<TableHead className="text-right">Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{loading ? (
						<TableRow>
							<TableCell colSpan={7} className="h-24 text-center">
								Loading users...
							</TableCell>
						</TableRow>
					) : sortedUsers.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="h-24 text-center">
								No users found
							</TableCell>
						</TableRow>
					) : (
						sortedUsers.map((user) => (
							<TableRow key={user.id}>
								<TableCell>
									<div className="flex items-center gap-3">
										<Avatar className="h-8 w-8">
											<AvatarImage
												src={user.avatar ?? ""}
												alt={user.fullName}
												onClick={() => setPreviewUserId(user.id as string)} // Set the specific user ID for preview
											/>
											<AvatarFallback>{user.fullName.slice(0, 1)}</AvatarFallback>
										</Avatar>
										<div className="font-medium">{user.fullName}</div>
									</div>
								</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>
									<RoleBadge role={user.role ?? ""} />
								</TableCell>
								<TableCell>
									<StatusBadge status={user.status} />
								</TableCell>
								<TableCell>{user.sessionCompleted}</TableCell>
								<TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
								<TableCell className="text-right">
									<DropdownMenu>
										<DropdownMenuTrigger asChild>
											<Button variant="ghost" size="icon">
												<MoreHorizontal className="h-4 w-4" />
												<span className="sr-only">Open menu</span>
											</Button>
										</DropdownMenuTrigger>
										<DropdownMenuContent align="end">
											<DropdownMenuLabel className="font-bold">Actions</DropdownMenuLabel>
											<DropdownMenuItem>View profile</DropdownMenuItem>
											<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
												<EditUserForm user={user} updateUser={updateUserInState} />
											</DropdownMenuItem>
											<DropdownMenuSeparator />
											<Alert
												triggerElement={
													<div className="w-full">
														<DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
															<Trash className="mr-2 h-4 w-4" />
															Delete user
														</DropdownMenuItem>
													</div>
												}
												contentTitle="Confirm Delete User"
												contentDescription={`Are you sure you want to delete "${user.fullName}"?`}
												actionText="Delete"
												onConfirm={() => handleDeleteUser(user.id as string)}
											/>
											<Alert
												triggerElement={
													<div className="w-full">
														<DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
															<ShieldOff className="mr-2 h-4 w-4" />
															{user.status === "blocked" ? "Unblock user" : "Block user"}
														</DropdownMenuItem>
													</div>
												}
												contentTitle={`Confirm ${user.status === "blocked" ? "Unblock" : "Block"} User`}
												contentDescription={`Are you sure you want to ${user.status === "blocked" ? "Unblock" : "Block"} "${user.fullName}"?`}
												actionText={`${user.status === "blocked" ? "Unblock" : "Block"}`}
												onConfirm={() => handleStatusUpdate(user.id as string)}
											/>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>

			{/* Preview Modal - Only shown if previewUserId is set */}
			{previewUserId && previewUser && (
				<div
					className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
					onClick={() => setPreviewUserId(null)} // Close preview when clicking outside
				>
					<div className="relative max-w-2xl w-full" onClick={(e) => e.stopPropagation()}>
						{" "}
						{/* Prevent closing when clicking inside */}
						<img src={previewUser.avatar || ""} alt={`${previewUser.fullName}'s profile preview`} className="w-full h-auto rounded-lg" />
						<Button
							variant="outline"
							className="absolute top-2 right-2"
							onClick={() => setPreviewUserId(null)} // Close preview
						>
							X
						</Button>
					</div>
				</div>
			)}
		</div>
	);
}

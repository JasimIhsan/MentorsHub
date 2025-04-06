import { ArrowUpDown, MoreHorizontal, ShieldOff, Trash, } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RoleBadge, StatusBadge } from "./UserBadges";
import { IUserDTO } from "@/interfaces/IUserDTO";
import { useState, useEffect } from "react";
import Alert from "@/components/custom-ui/alert";

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

	const handleSort = (column: "name" | "joinedDate") => {
		// Check if we're sorting by the same column
		const isSameColumn = sortColumn === column;

		// Toggle sort direction if sorting by the same column
		const newSortAsc = isSameColumn ? !sortAsc : true;
		setSortAsc(newSortAsc);
		setSortColumn(column); // Update the sort column to the clicked one

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

		setSortedUsers(sorted); // Set sorted array to state
	};

	useEffect(() => {
		setSortedUsers(users); // Update when users prop changes
	}, [users]);

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
											<AvatarImage src={user.avatar ?? ""} alt={user.fullName} />
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
											<DropdownMenuItem>Edit user</DropdownMenuItem>
											<DropdownMenuSeparator />
											{/* {user.role !== "mentor" && (
												<DropdownMenuItem>
													<UserCog className="mr-2 h-4 w-4" />
													Make mentor
												</DropdownMenuItem>
											)} */}
											{/* Delete Confirmation Alert */}
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
												onConfirm={() => handleDeleteUser(user.id as string)} // Only called when confirmed
											/>

											{/* Status Update Confirmation Alert */}
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
												onConfirm={() => handleStatusUpdate(user.id as string)} // Only called when confirmed
											/>
										</DropdownMenuContent>
									</DropdownMenu>
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}

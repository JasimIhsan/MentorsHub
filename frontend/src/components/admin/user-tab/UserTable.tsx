import { ArrowUpDown, MoreHorizontal, UserCog, ShieldOff, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { RoleBadge, StatusBadge } from "./UserBadges";
import { IUserDTO } from "@/interfaces/IUserDTO";

interface UserTableProps {
	users: IUserDTO[];
	loading: boolean;
}

export function UserTable({ users, loading }: UserTableProps) {
	return (
		<div className="rounded-md border px-3 py-1">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-[250px]">
							<div className="flex items-center">
								Name
								<Button variant="ghost" size="sm" className="ml-1 h-8 p-0">
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
								<Button variant="ghost" size="sm" className="ml-1 h-8 p-0">
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
					) : users.length === 0 ? (
						<TableRow>
							<TableCell colSpan={7} className="h-24 text-center">
								No users found
							</TableCell>
						</TableRow>
					) : (
						users.map((user) => (
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
											{user.role !== "mentor" && (
												<DropdownMenuItem>
													<UserCog className="mr-2 h-4 w-4" />
													Make mentor
												</DropdownMenuItem>
											)}
											<DropdownMenuItem className="text-destructive">
												<ShieldOff className="mr-2 h-4 w-4" />
												Block
											</DropdownMenuItem>
											<DropdownMenuItem className="text-destructive">
												<Trash className="mr-2 h-4 w-4" />
												Delete user
											</DropdownMenuItem>
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

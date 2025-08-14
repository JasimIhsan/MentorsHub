import { Alert } from "@/components/custom/alert";
import { PaginationControls } from "@/components/custom/PaginationControls";
import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { IWithdrawalRequestDTO, WithdrawalStatusEnum } from "@/interfaces/withdrawal.types";
import { formatDate } from "@/utility/time-data-formatter";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { AlertCircle, CreditCard } from "lucide-react";
import type { JSX } from "react";

interface RequestsTableProps {
	requests: IWithdrawalRequestDTO[];
	onApprove: (request: IWithdrawalRequestDTO) => void;
	onReject: (request: IWithdrawalRequestDTO) => void;
	getStatusBadge: (status: WithdrawalStatusEnum) => JSX.Element;
	formatCurrency: (amount: number) => string;
	activeTab: "pending" | "all";
	showPayButton: boolean;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

export function RequestsTable({ requests, activeTab, currentPage, totalPages, onPageChange, onApprove, onReject, getStatusBadge, formatCurrency, showPayButton }: RequestsTableProps) {
	if (requests.length === 0) {
		return (
			<div className="text-center py-8">
				<AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
				<p className="text-gray-600">No withdrawal requests found</p>
			</div>
		);
	}

	return (
		<div className="overflow-x-auto">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>SI No.</TableHead>
						<TableHead>User</TableHead>
						<TableHead>Amount</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Created</TableHead>
						<TableHead>Processed</TableHead>
						{activeTab === "pending" && <TableHead>Actions</TableHead>}
					</TableRow>
				</TableHeader>
				<TableBody>
					{requests.map((request, index) => (
						<TableRow key={request.id}>
							<TableCell className="font-mono text-sm">{index + 1}</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage className="w-8 h-8" src={request.user?.avatar} alt={`${request.user?.firstName} ${request.user?.lastName}`} />
										<AvatarFallback>{request.user?.firstName?.slice(0, 1)}</AvatarFallback>
									</Avatar>
									<p className="font-medium">
										{request.user?.firstName} {request.user?.lastName}
									</p>
									{/* <p className="text-sm text-gray-600 font-mono">{request.user?.}</p> */}
								</div>
							</TableCell>
							<TableCell className="font-semibold">{formatCurrency(request.amount)}</TableCell>
							<TableCell>{getStatusBadge(request.status)}</TableCell>
							<TableCell className="text-sm">{request.createdAt ? formatDate(request.createdAt) : "-"}</TableCell>
							<TableCell className="text-sm">{request.processedAt ? formatDate(request.processedAt) : "-"}</TableCell>
							{activeTab === "pending" && (
								<TableCell>
									<div className="flex gap-2">
										{showPayButton && request.status === WithdrawalStatusEnum.PENDING && (
											<Button size="sm" onClick={() => onApprove(request)}>
												<CreditCard className="w-3 h-3 mr-1" />
												Pay
											</Button>
										)}

										<Alert
											triggerElement={
												<Button size="sm" variant="destructive">
													Reject
												</Button>
											}
											actionText="Yes, Reject"
											contentDescription="Are you sure you want to reject this withdrawal request?"
											contentTitle="Reject Withdrawal Request?"
											onConfirm={() => onReject(request)}
										/>
									</div>
								</TableCell>
							)}
						</TableRow>
					))}
				</TableBody>
			</Table>
			<div className="mt-4">
				<PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={(page) => onPageChange(page)} />
			</div>
		</div>
	);
}

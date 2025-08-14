import { IWithdrawalRequestDTO, WithdrawalStatusEnum } from "@/interfaces/withdrawal.types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreditCard, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import type { JSX } from "react";
import { RequestPaymentConfirmationModal } from "@/components/admin/withdrawal-requests/RequestPaymentConfirmationModal";
import { formatDate } from "@/utility/time-data-formatter";
import { fetchWithdrawalsAdminAPI } from "@/api/withdrawal.api.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationControls } from "@/components/custom/PaginationControls";

const ITEMS_PER_PAGE = 10;

export function AdminWithdrawalRequestPage() {
	const [requests, setRequests] = useState<IWithdrawalRequestDTO[]>([]);
	const [activeTab, setActiveTab] = useState("pending");
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState<WithdrawalStatusEnum | "ALL">("ALL");
	const [selectedRequest, setSelectedRequest] = useState<IWithdrawalRequestDTO | null>(null);
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
	const [confirmAction, setConfirmAction] = useState<{ type: string; request: IWithdrawalRequestDTO } | null>(null);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		let finalStatus: WithdrawalStatusEnum | "ALL" = activeTab === "pending" ? WithdrawalStatusEnum.PENDING : status;
		const fetchRequests = async () => {
			const response = await fetchWithdrawalsAdminAPI(currentPage, ITEMS_PER_PAGE, finalStatus);
			if (response.success) {
				setRequests(response.requests);
				setTotalPages(Math.ceil(response.total / ITEMS_PER_PAGE));
			}
		};

		fetchRequests();
	}, [currentPage, status, activeTab]);

	const handlePayment = (request: IWithdrawalRequestDTO) => {
		setSelectedRequest(request);
		setIsPaymentModalOpen(true);
	};

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handlePaymentSuccess = (_requestId: string, _transactionId: string) => {
		// setRequests((prev) =>
		// 	prev.map((req) =>
		// 		req._id === requestId
		// 			? {
		// 					...req,
		// 					status: WithdrawalStatusEnum.COMPLETED,
		// 					transactionId,
		// 					processedAt: new Date().toISOString(),
		// 			  }
		// 			: req
		// 	)
		// );
	};

	const handleStatusChange = (request: IWithdrawalRequestDTO, newStatus: WithdrawalStatusEnum) => {
		setConfirmAction({ type: newStatus, request });
		setIsConfirmDialogOpen(true);
	};

	const confirmStatusChange = () => {
		if (!confirmAction) return;

		// setRequests((prev) =>
		// 	prev.map((req) =>
		// 		req._id === confirmAction.request._id
		// 			? {
		// 					...req,
		// 					status: confirmAction.type as WithdrawalStatusEnum,
		// 					processedAt: new Date().toISOString(),
		// 			  }
		// 			: req
		// 	)
		// );

		setIsConfirmDialogOpen(false);
		setConfirmAction(null);
	};

	const getStatusBadge = (status: WithdrawalStatusEnum): JSX.Element => {
		const variants = {
			[WithdrawalStatusEnum.PENDING]: {
				variant: "outline" as const,
				icon: Clock,
				className: "border-yellow-300 text-yellow-800",
			},
			[WithdrawalStatusEnum.COMPLETED]: {
				variant: "secondary" as const,
				icon: CheckCircle,
				className: "bg-green-100 text-green-800",
			},
			[WithdrawalStatusEnum.REJECTED]: {
				variant: "secondary" as const,
				icon: XCircle,
				className: "bg-gray-100 text-gray-800",
			},
		};

		const config = variants[status];
		const Icon = config.icon;

		return (
			<Badge variant={config.variant} className={config.className}>
				<Icon className="w-3 h-3 mr-1" />
				{status}
			</Badge>
		);
	};

	const formatCurrency = (amount: number) => {
		return new Intl.NumberFormat("en-IN", {
			style: "currency",
			currency: "INR",
		}).format(amount);
	};

	return (
		<div className="container mx-auto px-4 py-6 max-w-7xl">
			{/* Header */}
			<div className="mb-6">
				<h1 className="text-3xl font-bold text-gray-900 mb-2">Withdrawal Requests</h1>
				<p className="text-gray-600">Manage and process user withdrawal requests</p>
			</div>

			{/* Main Content */}
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>Withdrawal Requests</CardTitle>
						<CardDescription></CardDescription>
					</div>
					{activeTab === "all" && (
						<Select value={status} onValueChange={(value) => setStatus(value as WithdrawalStatusEnum)}>
							<SelectTrigger className="w-full sm:w-[140px]">
								<SelectValue placeholder="Status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="ALL">All Status</SelectItem>
								<SelectItem value={WithdrawalStatusEnum.PENDING}>Pending</SelectItem>
								<SelectItem value={WithdrawalStatusEnum.COMPLETED}>Completed</SelectItem>
								<SelectItem value={WithdrawalStatusEnum.REJECTED}>Cancelled</SelectItem>
							</SelectContent>
						</Select>
					)}
				</CardHeader>
				<CardContent>
					<Tabs value={activeTab} onValueChange={setActiveTab}>
						<TabsList className="grid w-full grid-cols-2">
							<TabsTrigger value="pending">Pending Requests</TabsTrigger>
							<TabsTrigger value="all">All Requests</TabsTrigger>
						</TabsList>

						<TabsContent value="pending" className="mt-6">
							<RequestsTable
								requests={requests}
								onPayment={handlePayment}
								onStatusChange={handleStatusChange}
								getStatusBadge={getStatusBadge}
								formatCurrency={formatCurrency}
								showPayButton={true}
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</TabsContent>

						<TabsContent value="all" className="mt-6">
							<RequestsTable
								requests={requests}
								onPayment={handlePayment}
								onStatusChange={handleStatusChange}
								getStatusBadge={getStatusBadge}
								formatCurrency={formatCurrency}
								showPayButton={false}
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
							/>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Payment Modal */}
			<RequestPaymentConfirmationModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} request={selectedRequest} onPaymentSuccess={handlePaymentSuccess} />

			{/* Confirmation Dialog */}
			<Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Confirm Status Change</DialogTitle>
						<DialogDescription>Are you sure you want to change the status of this request to {confirmAction?.type}?</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setIsConfirmDialogOpen(false)}>
							Cancel
						</Button>
						<Button onClick={confirmStatusChange}>Confirm</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

interface RequestsTableProps {
	requests: IWithdrawalRequestDTO[];
	onPayment: (request: IWithdrawalRequestDTO) => void;
	onStatusChange: (request: IWithdrawalRequestDTO, status: WithdrawalStatusEnum) => void;
	getStatusBadge: (status: WithdrawalStatusEnum) => JSX.Element;
	formatCurrency: (amount: number) => string;
	showPayButton: boolean;
	currentPage: number;
	totalPages: number;
	onPageChange: (page: number) => void;
}

function RequestsTable({ requests, currentPage, totalPages, onPageChange, onPayment, onStatusChange, getStatusBadge, formatCurrency, showPayButton }: RequestsTableProps) {
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
						<TableHead>Actions</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{requests.map((request, index) => (
						<TableRow key={request.id}>
							<TableCell className="font-mono text-sm">{index + 1}</TableCell>
							<TableCell>
								<div className="flex items-center gap-2">
									<Avatar>
										<AvatarImage src={request.user?.avatar} alt={`${request.user?.firstName} ${request.user?.lastName}`} />
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
							<TableCell>
								<div className="flex gap-2">
									{showPayButton && request.status === WithdrawalStatusEnum.PENDING && (
										<Button size="sm" onClick={() => onPayment(request)}>
											<CreditCard className="w-3 h-3 mr-1" />
											Pay
										</Button>
									)}
									{request.status === WithdrawalStatusEnum.PENDING && (
										<Button size="sm" variant="destructive" onClick={() => onStatusChange(request, WithdrawalStatusEnum.REJECTED)}>
											Reject
										</Button>
									)}
								</div>
							</TableCell>
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

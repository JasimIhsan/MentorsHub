import { IWithdrawalRequestDTO, WithdrawalStatusEnum } from "@/interfaces/withdrawal.types";
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditCard, AlertCircle, CheckCircle, XCircle, Clock } from "lucide-react";
import type { JSX } from "react";
import { RequestPaymentConfirmationModal } from "@/components/admin/withdrawal-requests/RequestPaymentConfirmationModal";
import { formatDate } from "@/utility/time-data-formatter";
import { fetchWithdrawalsAdminAPI, rejectWithdrawalRequestAdminAPI } from "@/api/withdrawal.api.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PaginationControls } from "@/components/custom/PaginationControls";
import { toast } from "sonner";
import { Alert } from "@/components/custom/alert";

const ITEMS_PER_PAGE = 4;

export function AdminWithdrawalRequestPage() {
	const [requests, setRequests] = useState<IWithdrawalRequestDTO[]>([]);
	const [activeTab, setActiveTab] = useState("pending");
	const [currentPage, setCurrentPage] = useState(1);
	const [status, setStatus] = useState<WithdrawalStatusEnum | "ALL">("ALL");
	const [selectedRequest, setSelectedRequest] = useState<IWithdrawalRequestDTO | null>(null);
	const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
	const [totalPages, setTotalPages] = useState(1);

	useEffect(() => {
		const finalStatus: WithdrawalStatusEnum | "ALL" = activeTab === "pending" ? WithdrawalStatusEnum.PENDING : status;
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

	const handlePaymentSuccess = (requestId: string, transactionId: string) => {
		setRequests((prev) => {
			const updated = prev.map((req) => (req.id === requestId ? { ...req, status: WithdrawalStatusEnum.COMPLETED, transactionId, processedAt: new Date().toISOString() } : req));

			// if we are in pending tab → filter out non-pending
			if (activeTab === "pending") {
				return updated.filter((req) => req.status === WithdrawalStatusEnum.PENDING);
			}

			return updated;
		});
	};

	const handleRejectRequest = async (request: IWithdrawalRequestDTO) => {
		try {
			const response = await rejectWithdrawalRequestAdminAPI(request.id);
			if (response.success) {
				setRequests((prev) => prev.filter((req) => req.id !== request.id));
			}
		} catch (error) {
			if (error instanceof Error) toast.error(error.message);
		}
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
								onApprove={handlePayment}
								onReject={handleRejectRequest}
								getStatusBadge={getStatusBadge}
								formatCurrency={formatCurrency}
								showPayButton={true}
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								activeTab="pending"
							/>
						</TabsContent>

						<TabsContent value="all" className="mt-6">
							<RequestsTable
								requests={requests}
								onApprove={handlePayment}
								onReject={handleRejectRequest}
								getStatusBadge={getStatusBadge}
								formatCurrency={formatCurrency}
								showPayButton={false}
								currentPage={currentPage}
								totalPages={totalPages}
								onPageChange={handlePageChange}
								activeTab="all"
							/>
						</TabsContent>
					</Tabs>
				</CardContent>
			</Card>

			{/* Payment Modal */}
			<RequestPaymentConfirmationModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} request={selectedRequest} onPaymentSuccess={handlePaymentSuccess} />
		</div>
	);
}

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

function RequestsTable({ requests, activeTab, currentPage, totalPages, onPageChange, onApprove, onReject, getStatusBadge, formatCurrency, showPayButton }: RequestsTableProps) {
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

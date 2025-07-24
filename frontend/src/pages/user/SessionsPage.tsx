import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { ISessionUserDTO } from "@/interfaces/session.interface";
import { SessionDetailsModal } from "@/components/custom/SessionDetailsModal";
import { fetchSessionsByUser } from "@/api/session.api.service";
import { PaginationControls } from "@/components/custom/PaginationControls";
import { SessionCardSkeleton } from "@/components/mentor/session-history/SessionSkeleton";
import { EmptyState } from "@/components/user/session/EmptyState";
import { PaymentMethodModal } from "@/components/user/session/PaymentMethodModal";
import { PaymentSuccessModal } from "@/components/user/session/PaymentSuccessModal";
import { ReviewModal } from "@/components/user/session/ReviewModal";
import { SessionCard } from "@/components/user/session/SessionCard";
import { CategoryFilter } from "@/components/user/session/CategoryFilter";
import { CancelSessionDialog } from "@/components/user/session/CancelSessionDialog";

declare global {
	interface Window {
		Razorpay: any;
	}
}

export function SessionsPage() {
	const [sessions, setSessions] = useState<ISessionUserDTO[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<"upcoming" | "approved" | "completed" | "canceled" | "all" | "pending" | "rejected">("all");
	const [sessionsLoading, setSessionsLoading] = useState(true); // Loading state for sessions
	const [error, setError] = useState<string | null>(null);
	const [showPaymentModal, setShowPaymentModal] = useState(false);
	const [paidSession, setPaidSession] = useState<ISessionUserDTO | null>(null);
	const [isRazorpayLoaded, setIsRazorpayLoaded] = useState(false);
	const [selectedSession, setSelectedSession] = useState<ISessionUserDTO | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [totalPages, setTotalPages] = useState(1);
	const [itemsPerPage] = useState(5);
	const [showCancelDialog, setShowCancelDialog] = useState(false);
	const [sessionToCancel, setSessionToCancel] = useState<ISessionUserDTO | null>(null);
	const [showReviewModal, setShowReviewModal] = useState(false);
	const [sessionToReview, setSessionToReview] = useState<ISessionUserDTO | null>(null);
	const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
	const [sessionToPay, setSessionToPay] = useState<ISessionUserDTO | null>(null);
	const user = useSelector((state: RootState) => state.userAuth.user);
	const [walletBalance, setWalletBalance] = useState(0);

	// Load Razorpay script
	useEffect(() => {
		let script: HTMLScriptElement | null = null;
		const loadRazorpayScript = () => {
			if (window.Razorpay) {
				setIsRazorpayLoaded(true);
				return;
			}
			script = document.createElement("script");
			script.src = "https://checkout.razorpay.com/v1/checkout.js";
			script.async = true;
			script.onload = () => setIsRazorpayLoaded(true);
			script.onerror = () => {
				toast.error("Failed to load payment gateway.");
				setIsRazorpayLoaded(false);
			};
			document.body.appendChild(script);
		};
		loadRazorpayScript();
		return () => {
			if (script && document.body.contains(script)) {
				document.body.removeChild(script);
			}
		};
	}, []);

	// Fetch sessions and wallet balance
	useEffect(() => {
		const fetchData = async () => {
			if (!user?.id) {
				setError("User not authenticated.");
				setSessionsLoading(false);
				return;
			}
			try {
				setSessionsLoading(true); // Start loading sessions
				// Fetch sessions with backend filtering
				const sessionsResponse = await fetchSessionsByUser(user.id, currentPage, itemsPerPage, selectedCategory);
				if (!sessionsResponse.success) {
					throw new Error("No sessions data received");
				}
				setSessions(sessionsResponse.sessions);
				setTotalPages(Math.ceil(sessionsResponse.total / itemsPerPage));
			} catch (err: any) {
				const message = err.response?.data?.message || "Failed to load data.";
				setError(message);
				toast.error(message);
			} finally {
				setSessionsLoading(false); // Stop loading sessions
			}
		};
		fetchData();
	}, [user?.id, currentPage, selectedCategory]);

	useEffect(() => {
		const fetchWalletBalance = async () => {
			try {
				const response = await axiosInstance.get(`/user/wallet/${user?.id}`);
				if (response.data.success) {
					setWalletBalance(response.data.wallet.balance || 0);
				}
			} catch (error) {
				setWalletBalance(0);
			}
		};
		fetchWalletBalance();
	}, [user?.id]);

	// Handle session cancellation
	const handleCancelSession = async () => {
		if (!sessionToCancel || !user?.id) return;
		try {
			const response = await axiosInstance.put(`/user/sessions/cancel-session`, {
				sessionId: sessionToCancel.id,
				userId: user.id,
			});
			if (response.data.success) {
				setSessions((prevSessions) => prevSessions.map((s) => (s.id === sessionToCancel.id ? { ...s, status: "canceled" } : s)));
				toast.success("Session canceled successfully.");
			} else {
				toast.error(response.data.message || "Failed to cancel session.");
			}
		} catch (error: any) {
			toast.error(error.response?.data?.message || "Failed to cancel session.");
		} finally {
			setShowCancelDialog(false);
			setSessionToCancel(null);
		}
	};

	if (error) {
		toast.error(error);
		return null;
	}

	return (
		<div className="w-full py-8 px-10 md:px-20 xl:px-25">
			<div className="flex flex-col gap-8">
				<div className="flex flex-col gap-4">
					<h1 className="text-3xl font-bold tracking-tight">My Sessions</h1>
					<p className="text-muted-foreground">Manage your mentoring sessions</p>
				</div>
				<Card>
					<CardHeader className="pb-0">
						<CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
					</CardHeader>
					<CardContent className="pt-6">
						<div className="space-y-4">
							{sessionsLoading ? (
								// Render skeleton for session cards
								Array.from({ length: itemsPerPage }).map((_, index) => <SessionCardSkeleton key={index} />)
							) : sessions.length === 0 ? (
								<EmptyState
									title={`No ${selectedCategory === "all" ? "sessions" : selectedCategory + " sessions"}`}
									description={`You don't have any ${selectedCategory === "all" ? "sessions" : selectedCategory + " sessions"}${
										selectedCategory === "canceled" || selectedCategory === "all" || selectedCategory === "rejected" ? "." : " scheduled."
									}`}
									action={
										selectedCategory !== "canceled" && selectedCategory !== "rejected" ? (
											<Button asChild>
												<Link to="/browse">Find a Mentor</Link>
											</Button>
										) : undefined
									}
								/>
							) : (
								sessions.map((session) => (
									<SessionCard
										key={session.id}
										session={session}
										setShowPaymentModal={setShowPaymentModal}
										setPaidSession={setPaidSession}
										isRazorpayLoaded={isRazorpayLoaded}
										setSelectedSession={setSelectedSession}
										setShowCancelDialog={setShowCancelDialog}
										setSessionToCancel={setSessionToCancel}
										setShowReviewModal={setShowReviewModal}
										setSessionToReview={setSessionToReview}
										setShowPaymentMethodModal={setShowPaymentMethodModal}
										setSessionToPay={setSessionToPay}
									/>
								))
							)}
						</div>
						<PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} className="mt-5" />
						<div className="mt-6 rounded-lg border border-dashed p-4 text-center">
							<p className="text-sm text-muted-foreground">Need to reschedule? Contact your mentor or support team.</p>
						</div>
					</CardContent>
				</Card>
			</div>
			{paidSession && (
				<PaymentSuccessModal
					isOpen={showPaymentModal}
					onClose={() => {
						setShowPaymentModal(false);
						setPaidSession(null);
						const fetchSessions = async () => {
							try {
								setSessionsLoading(true); // Start loading sessions
								const response = await fetchSessionsByUser(user?.id || "", currentPage, itemsPerPage, selectedCategory);
								setSessions(response.sessions);
								setTotalPages(Math.ceil(response.total / itemsPerPage));
							} catch (err: any) {
								toast.error("Failed to refresh sessions.");
							} finally {
								setSessionsLoading(false); // Stop loading sessions
							}
						};
						fetchSessions();
					}}
					session={paidSession}
				/>
			)}
			{selectedSession && <SessionDetailsModal session={selectedSession} onClose={() => setSelectedSession(null)} />}
			{sessionToReview && (
				<ReviewModal
					isOpen={showReviewModal}
					onClose={() => {
						setShowReviewModal(false);
						setSessionToReview(null);
					}}
					session={sessionToReview}
				/>
			)}
			{sessionToPay && (
				<PaymentMethodModal
					isOpen={showPaymentMethodModal}
					onClose={() => {
						setShowPaymentMethodModal(false);
						setSessionToPay(null);
					}}
					session={sessionToPay}
					walletBalance={walletBalance}
					isRazorpayLoaded={isRazorpayLoaded}
					setShowPaymentModal={setShowPaymentModal}
					setPaidSession={setPaidSession}
					userId={user?.id || ""}
				/>
			)}
			{sessionToCancel && <CancelSessionDialog isOpen={showCancelDialog} onClose={() => setShowCancelDialog(false)} session={sessionToCancel} onConfirm={handleCancelSession} />}
		</div>
	);
}

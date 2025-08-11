import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/UserLayout";
import Home from "@/pages/user/HomePage";
import Authentication from "@/pages/user/AuthenticationPage";
import ResetPasswordPage from "@/pages/user/ResetPasswordPage";
import PageNotFound from "@/pages/user/PageNotFoundPage";
import { ProtectedRoute } from "./ProtectedRoute";
import { AuthGuard } from "./AuthGuard";
import { DashboardPage } from "@/pages/user/DashboardPage";
import UserProfilePage from "@/pages/user/UserProfilePage";
import BrowseMentorsPage from "@/pages/user/BrowseMentorsPage";
import { BecomeMentorPage } from "@/pages/user/BecomeMentorPage";
import { MentorDetailsPage } from "@/pages/user/MentorDetailsPage";
import { RequestSessionPage } from "@/pages/user/RequestSessionPage";
import { RequestConfirmationPage } from "@/pages/user/RequestConfirmationPage";
import { SessionsPage } from "@/pages/user/SessionsPage";
import { WalletPage } from "@/pages/user/WalletPage";
import { MessagePage } from "@/pages/user/MessagePage";
import GamificationPage from "@/pages/user/GamificaitonPage";
import { VideoCallPage } from "@/pages/user/VideoCallPage";
import { SessionDetailsPage } from "@/pages/common/SessionDetailsPage";

const UserRoutes = () => {
	return (
		<Routes>
			<Route
				path="authenticate"
				element={
					<AuthGuard>
						<Authentication />
					</AuthGuard>
				}
			/>
			<Route path="reset-password/:token" element={<ResetPasswordPage />} />
			<Route path="/" element={<Home />} />
			<Route element={<MainLayout />}>
				<Route
					path="dashboard"
					element={
						<ProtectedRoute>
							<DashboardPage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/profile"
					element={
						<ProtectedRoute>
							<UserProfilePage />
						</ProtectedRoute>
					}
				/>
				<Route
					path="/browse"
					element={
						<ProtectedRoute>
							<BrowseMentorsPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/browse/mentor-profile/:mentorId"
					element={
						<ProtectedRoute>
							<MentorDetailsPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/become-mentor"
					element={
						<ProtectedRoute>
							<BecomeMentorPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/request-session/:mentorId"
					element={
						<ProtectedRoute>
							<RequestSessionPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/sessions/details/:sessionId"
					element={
						<ProtectedRoute>
							<SessionDetailsPage />
						</ProtectedRoute>
					}
				/>

				{/* <Route
					path="/checkout"
					element={
						<ProtectedRoute>
							<CheckoutPage />
						</ProtectedRoute>
					}
				/> */}

				<Route
					path="/request-confirmation"
					element={
						<ProtectedRoute>
							<RequestConfirmationPage />
						</ProtectedRoute>
					}
				/>

				{/* <Route
					path="/payment-confirmation"
					element={
						<ProtectedRoute>
							<PaymentConfirmationPage />
						</ProtectedRoute>
					}
				/> */}

				<Route
					path="/sessions"
					element={
						<ProtectedRoute>
							<SessionsPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/wallet"
					element={
						<ProtectedRoute>
							<WalletPage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/messages"
					element={
						<ProtectedRoute>
							<MessagePage />
						</ProtectedRoute>
					}
				/>

				<Route
					path="/gamification"
					element={
						<ProtectedRoute>
							<GamificationPage />
						</ProtectedRoute>
					}
				/>

				<Route path="*" element={<PageNotFound />} />
			</Route>

			<Route path="/video-call" element={<VideoCallPage />} />
		</Routes>
	);
};

export default UserRoutes;

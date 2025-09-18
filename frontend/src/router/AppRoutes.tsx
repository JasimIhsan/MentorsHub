import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { tokenClient, setAccessToken } from "@/api/config/api.config";
import { SocketProvider } from "@/context/SocketContext";
import { VideoCallPage } from "@/pages/user/VideoCallPage";
import { adminLogin, adminLogout } from "@/store/slices/adminSlice";
import { logout, login } from "@/store/slices/userSlice";
import { RootState } from "@/store/store";
import { useState, useEffect } from "react";
import AdminRoutes from "./admin/AdminRoutes";
import MentorRoutes from "./mentor/MentorRoutes";
import UserRoutes from "./user/UserRoutes";

const LoadingSpinner = () => (
	<div className="flex items-center justify-center w-screen h-screen ">
		<div className="flex flex-col items-center gap-4">
			<div className="relative">
				<div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
				<div className="absolute inset-0 w-12 h-12 m-2 border-4 border-t-purple-500 border-transparent rounded-full animate-spin [animation-duration:1.5s]"></div>
			</div>
			<div className="text-lg font-semibold text-gray-700 animate-pulse">Loading your experience...</div>
		</div>
	</div>
);

export const AppRoutes = () => {
	const [isLoading, setIsLoading] = useState(true);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const location = useLocation();
	const userId = useSelector((state: RootState) => state.userAuth.user?.id);

	const publicRoutes = ["/authenticate", "/admin/login"];

	useEffect(() => {
		const AuthUser = async () => {
			if (publicRoutes.includes(location.pathname)) {
				setIsLoading(false);
				return;
			}

			try {
				const response = await tokenClient.post("/user/refresh-token");
				const { accessToken, user, isAdmin } = response.data;
				setAccessToken(accessToken);

				if (isAdmin) {
					dispatch(logout());
					dispatch(adminLogin(user));
				} else {
					dispatch(adminLogout());
					dispatch(login(user));
				}
			} catch (error) {
				toast.error("Please login to continue");
				if (location.pathname.startsWith("/admin")) navigate("/admin/login", { replace: true });
				else navigate("/authenticate", { replace: true });
			} finally {
				setIsLoading(false);
			}
		};

		AuthUser();
	}, [dispatch, navigate, location.pathname]);

	if (isLoading) return <LoadingSpinner />;

	return (
		<SocketProvider userId={userId as string}>
			<Routes>
				<Route path="/*" element={<UserRoutes />} />
				<Route path="/admin/*" element={<AdminRoutes />} />
				<Route path="/mentor/*" element={<MentorRoutes />} />
				<Route path="/video-call/:sessionId" element={<VideoCallPage />} />
			</Routes>
		</SocketProvider>
	);
};

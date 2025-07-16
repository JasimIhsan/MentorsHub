import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "./store/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserRoutes from "./router/user/UserRoutes";
import AdminRoutes from "./router/admin/AdminRoutes";
import MentorRoutes from "./router/mentor/MentorRoutes";
import { VideoCallPage } from "./pages/user/VideoCallPage";
import { SocketProvider } from "./context/SocketContext";

// import PageNotFound from "./pages/PageNotFound";

function App() {
	const userId = useSelector((state: RootState) => state.userAuth.user?.id);
	console.log("userId: ", userId);
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	return (
		<GoogleOAuthProvider clientId={googleClientId}>
			<BrowserRouter>
				<SocketProvider userId={userId as string}>
					<Routes>
						<Route path="/*" element={<UserRoutes />} />
						<Route path="/admin/*" element={<AdminRoutes />} />
						<Route path="/mentor/*" element={<MentorRoutes />} />
						<Route path="/video-call/:sessionId" element={<VideoCallPage />} />
						{/* <Route path="*" element={<PageNotFound />} /> */}
					</Routes>
				</SocketProvider>
			</BrowserRouter>
		</GoogleOAuthProvider>
	);
}

export default App;

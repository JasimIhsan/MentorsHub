import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from "redux-persist/integration/react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import UserRoutes from "./router/user/UserRoutes";
import AdminRoutes from "./router/admin/AdminRoutes";
import MentorRoutes from "./router/mentor/MentorRoutes";
import { VideoCallWrapper } from "./pages/user/SampleVideoCall";

// import PageNotFound from "./pages/PageNotFound";

function App() {
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<GoogleOAuthProvider clientId={googleClientId}>
					<BrowserRouter>
						<Routes>
							<Route path="/*" element={<UserRoutes />} />
							<Route path="/admin/*" element={<AdminRoutes />} />
							<Route path="/mentor/*" element={<MentorRoutes />} />
							<Route path="/video-call/:sessionId" element={<VideoCallWrapper />} />
							{/* <Route path="*" element={<PageNotFound />} /> */}
						</Routes>
					</BrowserRouter>
				</GoogleOAuthProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;

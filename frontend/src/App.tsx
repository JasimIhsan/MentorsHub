import "./App.css";
import Authentication from "@/pages/user/Authentication";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DashboardPage } from "./pages/user/DashboardPage";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import { AuthGuard } from "./router/AuthGuard";
import MainLayout from "@/pages/user/Layout";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/user/Home";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; 

	if (!googleClientId) {
		console.error("Google Client ID is not set in the environment variables!");
	}

	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<GoogleOAuthProvider clientId={googleClientId}>
					<BrowserRouter>
						<Routes>
							{/* Public Route */}
							<Route
								path="/authenticate"
								element={
									<AuthGuard>
										<Authentication />
									</AuthGuard>
								}
							/>

							<Route path="/reset-password/:token" element={<ResetPasswordPage />} />

							{/* Protected Routes with MainLayout */}
							<Route element={<MainLayout />}>
								<Route path="/" element={<Home />} />
								<Route
									path="/dashboard"
									element={
										<ProtectedRoute>
											<DashboardPage />
										</ProtectedRoute>
									}
								/>
								<Route path="*" element={<PageNotFound />} />
							</Route>
						</Routes>
					</BrowserRouter>
				</GoogleOAuthProvider>
			</PersistGate>
		</Provider>
	);
}

export default App;

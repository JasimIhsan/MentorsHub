import "./App.css";
import Authentication from "@/pages/user/Authentication";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { DashboardPage } from "./pages/user/D";
import { DashboardPage } from "./pages/user/DashboardPage";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import { AuthGuard } from "./router/AuthGuard";
import MainLayout from "@/pages/user/Layout";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/user/Home";
// import AuthContainer from "./components/user/auth/AuthContainer";
import ResetPasswordPage from "./pages/user/ResetPasswordPage";

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
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
							{/* Add more protected routes here as needed */}
							<Route
								path="/"
								element={
									<ProtectedRoute>
										<DashboardPage />
									</ProtectedRoute>
								}
							/>{" "}
							{/* Default route */}
							<Route path="*" element={<PageNotFound />} />
						</Route>
					</Routes>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	);
}

export default App;

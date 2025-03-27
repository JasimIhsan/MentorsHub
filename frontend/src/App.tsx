import "./App.css";
import Authentication from "@/pages/user/Authentication";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/user/Dashboard";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import { AuthGuard } from "./router/AuthGuard";
// import AuthContainer from "./components/user/auth/AuthContainer";

function App() {
	return (
		<Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<BrowserRouter>
					<Routes>
						<Route
							path="/authenticate"
							element={
								<AuthGuard>
									<Authentication />
								</AuthGuard>
							}
						/>
						<Route
							path="/dashboard"
							element={
								<ProtectedRoute>
									<DashboardPage />
								</ProtectedRoute>
							}
						/>
						<Route path="*" element={<p>Page not found</p>} />
					</Routes>
				</BrowserRouter>
			</PersistGate>
		</Provider>
	);
}

export default App;

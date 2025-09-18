import "./App.css";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AppRoutes } from "./router/AppRoutes";

function App() {
	const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

	return (
		<GoogleOAuthProvider clientId={googleClientId}>
			<BrowserRouter>
				<AppRoutes />
			</BrowserRouter>
		</GoogleOAuthProvider>
	);
}

export default App;

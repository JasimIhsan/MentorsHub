// // src/components/auth/GoogleLoginButton.tsx
// import { googleAthentication } from "@/api/user/authentication";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";

// export default function GoogleLoginButton() {

// 	const handleGoogleLogin = async () => {
// 		console.log("Google login initiated");
// 		// Add Google OAuth logic here (e.g., redirect to Google auth URL)
// 		try {
// 			const response = await googleAthentication();
// 			console.log("response from google authentication : ", response);
// 		} catch (error: any) {
// 			console.log(`Google authentication error : `, error);
// 			toast.error(error.response.data.message);
// 		}
// 	};

// 	return (
// 		<div className="w-full mt-8">
// 			<Button variant="outline" className="w-full py-2 md:py-6" onClick={handleGoogleLogin}>
// 				<svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
// 					<path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
// 					<path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1.04.69-2.36 1.09-3.71 1.09-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C4.01 20.36 7.77 23 12 23z" fill="#34A853" />
// 					<path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.84z" fill="#FBBC05" />
// 					<path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.77 1 4.01 3.64 2.18 7.07l2.85 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
// 				</svg>
// 				Login with Google
// 			</Button>
// 		</div>
// 	);
// }

import { googleAthentication } from "@/api/user/authentication.api.service";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleLoginButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSuccess = async (response: any) => {
		console.log("Login Success:", response);
		const { credential } = response;

		const res = await googleAthentication(credential);
		console.log("res: ", res);
		if (res.success) {
			dispatch(login(res.user));
			navigate("/dashboard", { replace: true });
		}
	};

	const handleError = () => {
		console.log("Login Failed");
	};

	return <GoogleLogin onSuccess={handleSuccess} onError={handleError} size="large" />;
};

export default GoogleLoginButton;

import { googleAthentication } from "@/api/user/authentication.api.service";
import { GoogleLogin } from "@react-oauth/google";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const GoogleLoginButton = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const handleSuccess = async (response: any) => {
		try {
			const { credential } = response;
			const res = await googleAthentication(credential);
			if (res.success) {
				dispatch(login(res.user));
				navigate("/dashboard", { replace: true });
				toast.success("Google login successful");
			} else {
				toast.error("Google login failed. Please try again.");
			}
		} catch (error) {
			console.error("Google login error:", error);
			toast.error("An error occurred during Google login.");
		}
	};

	const handleError = () => {
		console.error("Google login failed");
		toast.error("Google login failed. Please try again.");
	};

	return (
		<div className="w-full flex justify-center">
			<div className="w-full max-w-[20rem] sm:max-w-[24rem] md:max-w-[28rem]">
				<GoogleLogin onSuccess={handleSuccess} onError={handleError} size="large" width="100%" theme="outline" shape="rectangular" logo_alignment="left" text="signin_with" />
			</div>
		</div>
	);
};

export default GoogleLoginButton;

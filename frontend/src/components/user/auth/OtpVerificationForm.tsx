import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
// import { useDispatch } from "react-redux";
import { verifyOtpAndCompleteRegistration } from "@/api/user/authentication";
import { ISignupData } from "@/interfaces/interfaces";

type FormState = "login" | "signup" | "forgot-password" | "reset-password" | "otp-varification";

interface OtpVerificationFormProps {
	setFormState: (value: FormState) => void;
	signupData: ISignupData;
}

const OtpVerificationForm = ({ setFormState, signupData }: OtpVerificationFormProps) => {
	const navigate = useNavigate();
	const { email } = useParams();
	const [otp, setOtp] = useState(["", "", "", "", "", ""]);
	const [loading, setLoading] = useState(false);
	const [resendLoading, setResendLoading] = useState(false);
	const [timer, setTimer] = useState(5); //150 2:30 minutes in seconds
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
	// const [error, setError] = useState(false);
	// const dispatch = useDispatch();

	useEffect(() => {
		if (!email) {
			navigate("/authenticate");
		}
	}, [email, navigate]);

	// Timer effect
	useEffect(() => {
		if (timer > 0) {
			const interval = setInterval(() => {
				setTimer((prev) => prev - 1);
			}, 1000);
			return () => clearInterval(interval);
		}
	}, [timer]);

	const formatTime = (seconds: number) => {
		const minutes = Math.floor(seconds / 60);
		const remainingSeconds = seconds % 60;
		return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
	};

	const handleInputChange = (index: number, value: string) => {
		if (isNaN(Number(value))) return;

		const newOtp = [...otp];
		newOtp[index] = value;
		setOtp(newOtp);

		if (value && index < 5) {
			const nextInput = document.getElementById(`otp-${index + 1}`);
			if (nextInput) nextInput.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text/plain").trim();
		if (/^\d{6}$/.test(pastedData)) {
			const digits = pastedData.split("");
			setOtp(digits);
			inputRefs.current[5]?.focus();
		}
	};

	const handleKeyDown = (index: number, e: any) => {
		if (e.key === "Backspace" && !otp[index] && index > 0) {
			const prevInput = document.getElementById(`otp-${index - 1}`);
			if (prevInput) prevInput.focus();
		}
	};

	const handleSubmit = async () => {
		setLoading(true);
		const otpString = otp.join("");

		if (!otpString) {
			toast.error("Please enter the OTP");
			setLoading(false);
			return;
		}

		const response = await verifyOtpAndCompleteRegistration(otpString, signupData);

		if (response.success) {
			// dispatch(login(mockResponse.data.user));
			setFormState("login");
			toast.success("Account created successfully");
			navigate("/dashboard", { replace: true });
		}

		// Add your OTP verification logic here
		// const response = await axiosInstance.post("/register", data);
		// if (response.data.success) {
		// dispatch(login(response.data.user));
		// 	form.reset();
		// 	setFormState("login");
		// 	navigate("/dashboard", { replace: true });
		// 	toast.success("Signup successful");
		// }
		setLoading(false);
	};

	const handleResend = async () => {
		setResendLoading(true);
		// Add your resend OTP logic here
		// For example:
		// const result = await resendOTP({ email: email as string });

		try {
			// Simulate API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			setTimer(5); // Reset timer
			setOtp(["", "", "", "", "", ""]); // Clear OTP inputs
			toast.success("New OTP sent successfully");
		} catch (error) {
			toast.error("Failed to resend OTP");
		}
		setResendLoading(false);
	};

	const handleBack = () => {
		setFormState("signup");
	};

	return (
		<Card className="border-0 shadow-none px-6">
			<CardHeader>
				<CardTitle className="text-2xl">Verify OTP</CardTitle>
				<CardDescription>Please enter the 6-digit code sent to {email}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="flex justify-between mb-6" onPaste={handlePaste}>
					{otp.map((digit, index) => (
						<Input
							key={index}
							ref={(el) => {
								inputRefs.current[index] = el;
							}}
							type="text"
							inputMode="numeric"
							id={`otp-${index}`}
							maxLength={1}
							value={digit}
							onChange={(e) => handleInputChange(index, e.target.value)}
							onKeyDown={(e) => handleKeyDown(index, e)}
							className="w-12 h-12 text-center text-lg font-medium"
							aria-label={`Digit ${index + 1} of OTP`}
						/>
					))}
				</div>
				<div className="text-center mb-4">
					<p className="text-sm text-muted-foreground">{timer > 0 ? `Resend available in ${formatTime(timer)}` : "You can now resend the OTP"}</p>
				</div>
				<Button variant="link" className="w-full" onClick={handleResend} disabled={timer > 0 || resendLoading}>
					{resendLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Sending...
						</>
					) : (
						"Resend OTP"
					)}
				</Button>
				{/* {error && <p className="text-sm text-destructive mb-4">{error}</p>} */}
			</CardContent>
			<CardFooter className="flex flex-col gap-4">
				<Button className="w-full" onClick={handleSubmit} disabled={loading}>
					{loading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							Verifying...
						</>
					) : (
						"Verify OTP"
					)}
				</Button>

				<Button variant="link" className="w-full" onClick={handleBack} disabled={loading}>
					Back
				</Button>
			</CardFooter>
		</Card>
	);
};

export default OtpVerificationForm;

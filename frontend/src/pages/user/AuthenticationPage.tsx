import { WelcomeSection } from "@/components/user/auth/WelcomeSection";
import AuthContainer from "@/components/user/auth/AuthContainer";

export default function Authentication() {
	return (
		<main className="flex min-h-screen min-w-screen flex-col md:flex-row bg-amber-300">
			<WelcomeSection />
			<AuthContainer />
		</main>
	);
}

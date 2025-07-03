import { WelcomeSection } from "@/components/user/auth/WelcomeSection";
import AuthContainer from "@/components/user/auth/AuthContainer";

export default function Authentication() {
  return (
    <main className="flex min-h-screen w-full flex-col md:flex-row">
      <WelcomeSection />
      <AuthContainer />
    </main>
  );
}
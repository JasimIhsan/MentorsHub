import React from "react";
import { UserInterface } from "@/interfaces/interfaces";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface WelcomeSectionProps {
	user: UserInterface;
}

const WelcomeHeader: React.FC<WelcomeSectionProps> = ({ user }) => {
	const navigate = useNavigate();
	return (
		<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-2 h-auto sm:h-40 justify-between  px-10 md:px-20 xl:px-25 py-6 sm:py-0 bg-gradient-to-b from-blue-200/80 to-background">
			<div className="space-y-2">
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
					Welcome back, {user.firstName} {user.lastName}
				</h1>
				<p className="text-sm sm:text-base text-muted-foreground">Here's what's happening with your mentorship journey.</p>
			</div>
			{user.role === "mentor" && (
				<div className="flex justify-center">
					<Button className="flex gap-2 w-full sm:w-auto" onClick={() => navigate("/mentor/dashboard")}>
						<ArrowRightLeft className="h-4 w-4 sm:h-5 sm:w-5" />
						Switch to Mentor Dashboard
					</Button>
				</div>
			)}
		</div>
	);
};

export default WelcomeHeader;

// src/components/dashboard/WelcomeSection.tsx
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
		<div className="flex items-center gap-2 h-40 justify-between px-10 md:px-20 xl:px-25 bg-gradient-to-b from-blue-200/80 to-background">
			{/* // <div className="flex items-center gap-2 h-40 justify-between px-10 md:px-20 xl:px-25 bg-amber-400"> */}
			<div>
				<h1 className="text-3xl font-bold tracking-tight">
					Welcome back, {user.firstName} {user.lastName}
				</h1>
				<p className="text-muted-foreground">Here's what's happening with your mentorship journey.</p>
			</div>
			{user.role === "mentor" && (
				<div>
					<Button className="flex gap-4" onClick={() => navigate("/mentor/dashboard")}>
						{" "}
						<ArrowRightLeft />
						Switch to Mentor Dashboard
					</Button>
				</div>
			)}
		</div>
	);
};

export default WelcomeHeader;

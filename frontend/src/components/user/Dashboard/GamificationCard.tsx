import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Zap } from "lucide-react";
import { Link } from "react-router-dom";

interface GamificationCardProps {
	onTestClick: () => Promise<void>;
}

const GamificationCard: React.FC<GamificationCardProps> = ({ onTestClick }) => {
	return (
		<Card className="bg-gradient-to-r from-purple-900 to-purple-700">
			<CardContent className="px-6 py-3">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="flex h-15 w-15 items-center justify-center rounded-full bg-white">
							<Award className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h3 className="font-bold text-xl text-muted">Level 12 Growth Seeker</h3>
							<div className="flex items-center gap-2 text-sm text-muted">
								<span>1,240 XP</span>
								<span>•</span>
								<span>760 XP until Level 13</span>
							</div>
						</div>
					</div>
					<Button onClick={onTestClick}>Test</Button>
					<div className="flex items-center gap-3">
						<div className="flex items-center gap-1">
							<Zap className="h-4 w-4 text-yellow-500" />
							<span className="text-sm text-muted font-medium">8 Week Streak!</span>
						</div>
						<Button asChild size="sm" className="bg-background text-primary hover:bg-secondary">
							<Link to="/gamification">View Progress</Link>
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};

export default GamificationCard;

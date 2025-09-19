import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import { Award, Zap, Star, Trophy, Medal } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { fetchUserProgressAPI } from "@/api/gamification.api.service";

// Define UserStats interface
interface UserStats {
	totalXP: number;
	level: number;
	xpToNextLevel: number;
	streak?: number; // Optional, assuming API might return streak
	badges?: string[]; // Added to store earned badges
}

const GamificationCard = () => {
	const [userStats, setUserStats] = useState<UserStats | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const userId = useSelector((state: RootState) => state.userAuth.user?.id);

	// Fetch user stats from API
	useEffect(() => {
		const fetchUserStats = async () => {
			if (!userId) return;
			setIsLoading(true);
			try {
				const response = await fetchUserProgressAPI(userId);
				if (response.success) {
					setUserStats(response.progress);
				}
			} catch (error) {
				toast.error("Failed to fetch user stats");
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchUserStats();
	}, [userId]);

	// Define level title ranges
	const getLevelTitle = (level: number) => {
		if (level >= 1 && level <= 3) return "Beginner";
		if (level >= 4 && level <= 6) return "Apprentice";
		if (level >= 7 && level <= 9) return "Journeyman";
		if (level >= 10 && level <= 12) return "Expert";
		if (level >= 13 && level <= 15) return "Master";
		if (level >= 16 && level <= 18) return "Grandmaster";
		if (level >= 19 && level <= 21) return "Legend";
		if (level >= 22 && level <= 24) return "Mythic";
		if (level >= 25 && level <= 27) return "Hero";
		if (level >= 28 && level <= 30) return "Champion";
		return `Titan`; // For levels 31+
	};

	// Define badge icons and descriptions
	const getBadgeIcon = (badge: string) => {
		switch (badge) {
			case "FirstWin":
				return <Star className="h-5 w-5 text-yellow-400" />;
			case "StreakMaster":
				return <Zap className="h-5 w-5 text-orange-400" />;
			case "LevelUp":
				return <Trophy className="h-5 w-5 text-gold-400" />;
			case "Endurance":
				return <Medal className="h-5 w-5 text-bronze-400" />;
			default:
				return <Award className="h-5 w-5 text-primary" />;
		}
	};

	// Badge descriptions
	const getBadgeDescription = (badge: string) => {
		switch (badge) {
			case "FirstWin":
				return "Earned for completing your first challenge!";
			case "StreakMaster":
				return "Achieved a 7-day streak!";
			case "LevelUp":
				return "Reached level 5!";
			case "Endurance":
				return "Completed 10 challenges in a row!";
			default:
				return "Special achievement!";
		}
	};

	if (isLoading) {
		return (
			<Card className="bg-gradient-to-r from-purple-900 to-purple-700">
				<CardContent className="px-6 py-3">
					<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
						<div className="flex items-center gap-4">
							<Skeleton className="bg-gray-200 h-15 w-15 rounded-full" /> {/* Skeleton for icon */}
							<div className="space-y-2">
								<Skeleton className="bg-gray-200 h-6 w-40" /> {/* Skeleton for level title */}
								<Skeleton className="bg-gray-200 h-4 w-60" /> {/* Skeleton for XP text */}
							</div>
						</div>
						<Skeleton className="bg-gray-200 h-10 w-20" /> {/* Skeleton for Test button */}
						<Skeleton className="bg-gray-200 h-8 w-28" /> {/* Skeleton for View Progress button */}
					</div>
					{/* <div className="mt-4">
						<Skeleton className="bg-gray-200 h-4 w-20" /> 
						<div className="flex flex-wrap gap-2 mt-2">
							<Skeleton className="bg-gray-200 h-6 w-24 rounded-full" /> 
							<Skeleton className="bg-gray-200 h-6 w-24 rounded-full" /> 
						</div>
					</div> */}
				</CardContent>
			</Card>
		);
	}

	if (!userStats) {
		return (
			<Card className="bg-gradient-to-r from-purple-900 to-purple-700">
				<CardContent className="px-6 py-3">
					<p className="text-red-300 text-center">Unable to load stats</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-gradient-to-r from-purple-900 to-purple-700">
			<CardContent className="px-6 py-3">
				<div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
					<div className="flex items-center gap-4">
						<div className="flex h-15 w-15 items-center justify-center rounded-full bg-white">
							<Award className="h-6 w-6 text-primary" />
						</div>
						<div>
							<h3 className="font-bold text-xl text-muted">
								Level {userStats.level} {getLevelTitle(userStats.level)}
							</h3>
							<div className="flex items-center gap-2 text-sm text-muted">
								<span>{userStats.totalXP.toLocaleString()} XP</span>
								<span>•</span>
								<span>
									{userStats.xpToNextLevel.toLocaleString()} XP until Level {userStats.level + 1}
								</span>
							</div>
						</div>
					</div>
					{/* <Button onClick={onTestClick}>Test</Button> */}
					<div className="flex flex-col gap-2">
						<Button asChild size="sm" className=" hover:bg-secondary">
							<Link to="/gamification">View Progress</Link>
						</Button>
					</div>
				</div>
				{/* Display badges if available */}
				{userStats.badges && userStats.badges.length > 0 && (
					<div className="mt-4">
						<h4 className="text-sm font-semibold text-muted">Awards</h4>
						<div className="flex flex-wrap gap-2 mt-2">
							{userStats.badges.map((badge, index) => (
								<div key={index} className="flex items-center gap-2 bg-gray-800 px-3 py-1 rounded-full text-xs text-muted" title={getBadgeDescription(badge)}>
									{getBadgeIcon(badge)}
									<span>{badge}</span>
								</div>
							))}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
};

export default GamificationCard;

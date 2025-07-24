import { Skeleton } from "@/components/ui/skeleton";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// UserGrowthChart component
export function UserGrowthChart({ userGrowthData, isLoading }: { userGrowthData: { name: string; users: number; mentors: number }[]; isLoading: boolean }) {
	if (isLoading) {
		return (
			<div className="space-y-4">
				<Skeleton className="h-6 w-32 bg-gray-200" />
				<Skeleton className="h-64 w-full bg-gray-200" />
			</div>
		);
	}
	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={userGrowthData}>
				<XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<Tooltip />
				<Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 6 }} />
				<Line type="monotone" dataKey="mentors" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 6 }} />
			</LineChart>
		</ResponsiveContainer>
	);
}

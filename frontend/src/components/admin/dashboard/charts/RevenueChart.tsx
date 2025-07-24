import { Skeleton } from "@/components/ui/skeleton";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// RevenueChart component
export function RevenueChart({ data, isLoading }: { data: { name: string; total: number }[]; isLoading: boolean }) {
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
			<LineChart data={data}>
				<XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `₹${value}`} />
				<Tooltip formatter={(value: number) => [`₹${value}`, "Revenue"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
				<Line type="monotone" dataKey="total" stroke="currentColor" strokeWidth={2} className="text-primary" dot={false} activeDot={{ r: 6 }} />
			</LineChart>
		</ResponsiveContainer>
	);
}

import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface MentorPerformanceChartProps {
	isLoading: boolean;
	error: string | null;
	data: {
		week: string;
		sessions: number;
		revenue: number;
	}[];
}

export function MentorPerformanceChart({ data, isLoading, error }: MentorPerformanceChartProps) {
	// Render loading state
	if (isLoading) {
		return (
			<div className="w-full">
				<div className="mb-4">
					<Skeleton className="h-10 w-32 bg-gray-200" />
				</div>
				<div className="h-[300px]">
					<Skeleton className="h-full w-full bg-gray-200 rounded-lg" />
				</div>
			</div>
		);
	}

	// Render error state
	if (error) {
		return <div>Error: {error}</div>;
	}

	// Render chart
	return (
		<div className="w-full">
			<div className="h-[300px]">
				<ResponsiveContainer width="100%" height="100%">
					<LineChart
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="week" />
						<YAxis yAxisId="left" orientation="left" stroke="#6366f1" />
						<YAxis yAxisId="right" orientation="right" stroke="#10b981" />
						<Tooltip />
						<Legend />
						<Line yAxisId="left" dataKey="sessions" stroke="#6366f1" name="Sessions" />
						<Line yAxisId="right" dataKey="revenue" stroke="#10b981" name="Revenue ($)" />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

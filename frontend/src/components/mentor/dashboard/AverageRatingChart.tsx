import { Area, AreaChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
	name: string;
	averageRating: number;
}

interface MentorPerformanceChartProps {
	data: ChartData[];
	isLoading: boolean;
	error: string | null;
}

export function MentorReviewRatingChart({ data, isLoading, error }: MentorPerformanceChartProps) {
	// Render loading state
	if (isLoading) {
		return (
			<div className="w-full">
				<div className="mb-4 flex justify-end">
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
					<AreaChart
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}>
						{/* <CartesianGrid strokeDasharray="3 3" /> */}
						<XAxis dataKey="name" />
						<YAxis
							domain={[1, 5]}
							ticks={[1, 2, 3, 4, 5]} // Explicit ticks for 1 to 5
							tickFormatter={(value) => "★".repeat(value)} // Show stars: ★, ★★, ★★★, ★★★★, ★★★★★
						/>
						<Tooltip formatter={(value) => "★".repeat(Number(value))} /> {/* Show stars in tooltip */}
						<Legend />
						<Area type="monotone" dataKey="averageRating" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} name="Average Rating" />
					</AreaChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

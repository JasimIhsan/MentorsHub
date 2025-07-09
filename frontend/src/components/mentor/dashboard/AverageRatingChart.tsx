import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ChartData {
	name: string;
	averageRating: number;
}

interface MentorPerformanceChartProps {
	data: ChartData[];
	isLoading: boolean;
	error: string | null;
	filterPeriod: string;
	handleFilterChange: (value: string) => void;
}

export function MentorReviewRatingChart({ data, isLoading, error, filterPeriod, handleFilterChange }: MentorPerformanceChartProps) {
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
			<div className="mb-4 flex justify-end">
				<Select value={filterPeriod} onValueChange={handleFilterChange}>
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="Select period" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="month">Last Month</SelectItem>
						<SelectItem value="sixMonths">Last 6 Months</SelectItem>
						<SelectItem value="year">Last Year</SelectItem>
					</SelectContent>
				</Select>
			</div>
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
						<XAxis dataKey="name" />
						<YAxis domain={[1, 5]} unit="★" tickFormatter={(value) => `${value}`} />
						<Tooltip formatter={(value) => `${value}★`} />
						<Legend />
						<Line type="monotone" dataKey="averageRating" stroke="#8884d8" name="Average Rating" dot={false} />
					</LineChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

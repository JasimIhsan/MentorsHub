import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Import Shadcn/UI Select components

interface MentorPerformanceChartProps {
	isLoading: boolean;
	error: string | null;
	filterPeriod: string;
	data: {
		week: string;
		sessions: number;
		revenue: number;
	}[];
	handleFilterChange: (value: "all" | "month" | "sixMonths" | "year") => void;
}

export function MentorPerformanceChart({ data, isLoading, error, filterPeriod, handleFilterChange }: MentorPerformanceChartProps) {
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
			<div className="mb-4">
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
					<BarChart
						data={data}
						margin={{
							top: 20,
							right: 30,
							left: 20,
							bottom: 5,
						}}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="week" />
						<YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
						<YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
						<Tooltip />
						<Legend />
						<Bar yAxisId="left" dataKey="sessions" fill="#8884d8" name="Sessions" />
						<Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
					</BarChart>
				</ResponsiveContainer>
			</div>
		</div>
	);
}

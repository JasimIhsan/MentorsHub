import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function PlanPerformanceChart() {
	const data = [
		{
			name: "Basic Plan",
			sessions: 24,
			revenue: 480,
		},
		{
			name: "Pro Plan",
			sessions: 18,
			revenue: 720,
		},
		{
			name: "Premium Plan",
			sessions: 8,
			revenue: 640,
		},
		{
			name: "Group Sessions",
			sessions: 12,
			revenue: 360,
		},
	];

	return (
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
					<XAxis dataKey="name" />
					<YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
					<YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
					<Tooltip />
					<Legend />
					<Bar yAxisId="left" dataKey="sessions" fill="#8884d8" name="Sessions" />
					<Bar yAxisId="right" dataKey="revenue" fill="#82ca9d" name="Revenue ($)" />
				</BarChart>
			</ResponsiveContainer>
		</div>
	);
}

import { useState } from "react";
import { Line, LineChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

// Sample weekly data for a year
const generateSampleData = () => {
	const weeks = Array.from({ length: 52 }, (_, i) => `Week ${i + 1}`);
	return weeks.map((week) => ({
		name: week,
		averageRating: (Math.random() * 2 + 3).toFixed(1), // 3.0-5.0 stars
	}));
};

export function MentorReviewRatingChart() {
	// State for filter period
	const [filterPeriod, setFilterPeriod] = useState("month");

	// Generate sample data
	const fullData = generateSampleData();

	// Filter data based on selected period
	const getFilteredData = () => {
		switch (filterPeriod) {
			case "month":
				return fullData.slice(-4); // Last 4 weeks
			case "sixMonths":
				return fullData.slice(-24); // Last 24 weeks
			case "year":
				return fullData; // All 52 weeks
			default:
				return fullData.slice(-4);
		}
	};

	const data = getFilteredData();

	// Handle filter change
	const handleFilterChange = (e: any) => {
		setFilterPeriod(e.target.value);
	};

	return (
		<div className="w-full">
			{/* Filter dropdown */}
			<div className="mb-4 flex justify-end">
				<select value={filterPeriod} onChange={handleFilterChange} className="p-2 border rounded-md bg-white text-gray-700">
					<option value="month">Last Month</option>
					<option value="sixMonths">Last 6 Months</option>
					<option value="year">Last Year</option>
				</select>
			</div>

			{/* Chart container */}
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

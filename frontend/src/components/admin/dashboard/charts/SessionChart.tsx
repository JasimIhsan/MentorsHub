"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";

const data = [
	{ name: "Technology", value: 35, color: "#2563eb" },
	{ name: "Business", value: 25, color: "#16a34a" },
	{ name: "Design", value: 20, color: "#d97706" },
	{ name: "Marketing", value: 15, color: "#dc2626" },
	{ name: "Other", value: 5, color: "#6b7280" },
];

export function SessionsChart() {
	return (
		<ResponsiveContainer width="100%" height={300}>
			<PieChart>
				<Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
					{data.map((entry, index) => (
						<Cell key={`cell-${index}`} fill={entry.color} />
					))}
				</Pie>
				<Tooltip formatter={(value) => [`${value}%`, "Sessions"]} />
				<Legend />
			</PieChart>
		</ResponsiveContainer>
	);
}

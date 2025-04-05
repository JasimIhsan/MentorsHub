import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const data = [
	{
		name: "Jan",
		total: 4200,
	},
	{
		name: "Feb",
		total: 5100,
	},
	{
		name: "Mar",
		total: 4800,
	},
	{
		name: "Apr",
		total: 6300,
	},
	{
		name: "May",
		total: 7200,
	},
	{
		name: "Jun",
		total: 8100,
	},
];

export function RevenueChart() {
	return (
		<ResponsiveContainer width="100%" height={300}>
			<BarChart data={data}>
				<XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
				<Tooltip formatter={(value: number) => [`$${value}`, "Revenue"]} cursor={{ fill: "rgba(0, 0, 0, 0.05)" }} />
				<Bar dataKey="total" fill="currentColor" radius={[4, 4, 0, 0]} className="fill-primary" />
			</BarChart>
		</ResponsiveContainer>
	);
}

import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
	{
		name: "Jan",
		users: 120,
		mentors: 15,
	},
	{
		name: "Feb",
		users: 180,
		mentors: 22,
	},
	{
		name: "Mar",
		users: 250,
		mentors: 28,
	},
	{
		name: "Apr",
		users: 310,
		mentors: 35,
	},
	{
		name: "May",
		users: 420,
		mentors: 48,
	},
	{
		name: "Jun",
		users: 520,
		mentors: 62,
	},
];

export function UserGrowthChart() {
	return (
		<ResponsiveContainer width="100%" height={300}>
			<LineChart data={data}>
				<XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
				<Tooltip />
				<Line type="monotone" dataKey="users" stroke="#2563eb" strokeWidth={2} activeDot={{ r: 6 }} />
				<Line type="monotone" dataKey="mentors" stroke="#16a34a" strokeWidth={2} activeDot={{ r: 6 }} />
			</LineChart>
		</ResponsiveContainer>
	);
}

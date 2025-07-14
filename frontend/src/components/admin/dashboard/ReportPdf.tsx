import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";

// Import the logo image
import logo from "@/assets/MentorsHub logo image.jpg";

// Register Winky Sans font to support the rupee symbol
Font.register({
	family: "Winky Sans",
	src: "/fonts/WinkySans-Regular.ttf",
	fontWeight: "normal",
	fontStyle: "normal",
});

// Styles for PDF
const styles = StyleSheet.create({
	page: {
		padding: 40,
		fontSize: 10,
		fontFamily: "Winky Sans",
		color: "#333",
		backgroundColor: "#fff",
	},
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 20,
		borderBottomWidth: 2,
		borderBottomColor: "#112d4e",
		paddingBottom: 10,
	},
	logoPlaceholder: {
		width: 75,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		color: "#112d4e",
		fontFamily: "Winky Sans",
	},
	sidebar: {
		width: 140,
		backgroundColor: "#f8fafc",
		padding: 15,
		borderRadius: 8,
		marginRight: 20,
	},
	sidebarTitle: {
		fontSize: 12,
		fontWeight: "bold",
		marginBottom: 10,
		color: "#2d3748",
		fontFamily: "Winky Sans",
	},
	sidebarText: {
		fontSize: 9,
		marginBottom: 5,
		color: "#4a5568",
		fontFamily: "Winky Sans",
	},
	content: {
		flex: 1,
	},
	section: {
		marginBottom: 15,
		padding: 10,
		borderRadius: 4,
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: "#edf2f7",
	},
	sectionTitle: {
		fontSize: 14,
		fontWeight: "bold",
		color: "#2d3748",
		marginBottom: 8,
		fontFamily: "Winky Sans",
	},
	subSectionTitle: {
		fontSize: 12,
		fontWeight: "bold",
		color: "#112d4e",
		marginBottom: 6,
		fontFamily: "Winky Sans",
	},
	text: {
		fontSize: 10,
		color: "#4a5568",
		marginBottom: 4,
		fontFamily: "Winky Sans",
	},
	table: {
		width: "100%",
		borderWidth: 1,
		borderColor: "#e2e8f0",
		borderRadius: 4,
		overflow: "hidden",
		marginBottom: 10,
	},
	tableRow: {
		flexDirection: "row",
		borderBottomWidth: 1,
		borderBottomColor: "#e2e8f0",
	},
	tableRowAlternate: {
		backgroundColor: "#f7fafc",
	},
	tableCell: {
		padding: 8,
		flex: 1,
		borderRightWidth: 1,
		borderRightColor: "#e2e8f0",
		fontSize: 9,
		color: "#4a5568",
		fontFamily: "Winky Sans",
	},
	tableCellLast: {
		padding: 8,
		flex: 1,
		fontSize: 9,
		color: "#4a5568",
		fontFamily: "Winky Sans",
	},
	tableHeader: {
		backgroundColor: "#edf2f7",
		fontWeight: "bold",
		color: "#2d3748",
		fontFamily: "Winky Sans",
	},
	footer: {
		position: "absolute",
		bottom: 20,
		left: 40,
		right: 40,
		flexDirection: "row",
		justifyContent: "space-between",
		fontSize: 8,
		color: "#718096",
		borderTopWidth: 1,
		borderTopColor: "#e2e8f0",
		paddingTop: 5,
		fontFamily: "Winky Sans",
	},
	pageNumber: {
		fontSize: 8,
		fontFamily: "Winky Sans",
	},
});

// Interface for Mentor
interface Mentor {
	id: string;
	name: string;
	avatar: string;
	rating: number;
	revenue: number;
	sessions: number;
}

// Interface for PDF props
interface AdminDashboardPDFProps {
	name: string;
	stats: {
		totalUsers: number;
		totalMentors: number;
		totalSessions: number;
		totalRevenue: number;
	};
	revenue: { name: string; total: number }[];
	revenueFilter:"all" | "30days" | "6months" | "1year";
	userGrowth: { name: string; users: number; mentors: number }[];
	userGrowthFilter:"all" | "30days" | "6months" | "1year";
	topMentors: Mentor[];
	isLoading: boolean;
}

// PDF Document Component
export const AdminDashboardPDF = ({ name, stats, revenue, revenueFilter, userGrowth, userGrowthFilter, topMentors, isLoading }: AdminDashboardPDFProps) => {
	if (isLoading) {
		return <Text>Loading...</Text>;
	}

	// Platform metrics static data
	const metrics = [
		{ title: "Avg. Session Duration", value: "45 min" },
		{ title: "User Retention Rate", value: "78%" },
		{ title: "Avg. Mentor Rating", value: "4.8" },
		{ title: "Monthly Active Users", value: "1,892" },
	];

	return (
		<Document>
			{/* Page 1: Admin Info, Sidebar, Key Statistics, Platform Metrics */}
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header} fixed>
					<Image style={styles.logoPlaceholder} src={logo} />
					<Text style={styles.title}>Platform Analytics Report</Text>
				</View>

				{/* Main Content with Sidebar */}
				<View style={{ flexDirection: "row" }}>
					{/* Sidebar */}
					<View style={styles.sidebar}>
						<Text style={styles.sidebarTitle}>Quick Stats</Text>
						<Text style={styles.sidebarText}>Total Users: {stats.totalUsers}</Text>
						<Text style={styles.sidebarText}>Total Mentors: {stats.totalMentors}</Text>
						<Text style={styles.sidebarText}>Sessions Conducted: {stats.totalSessions}</Text>
						<Text style={styles.sidebarText}>Total Revenue: ₹{stats.totalRevenue.toLocaleString()}</Text>
					</View>

					{/* Content */}
					<View style={styles.content}>
						{/* Admin Info */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Admin Information</Text>
							<Text style={styles.text}>Admin: {name}</Text>
							<Text style={styles.text}>Email: mailto:mentorshub000@gmail.com</Text>
							<Text style={styles.text}>Generated Date: {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</Text>
							<Text style={styles.text}>Revenue Filter: {revenueFilter}</Text>
							<Text style={styles.text}>User Growth Filter: {userGrowthFilter}</Text>
						</View>

						{/* Key Statistics */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Key Statistics</Text>
							<View style={styles.table}>
								<View style={[styles.tableRow, styles.tableHeader]}>
									<Text style={styles.tableCell}>Metric</Text>
									<Text style={styles.tableCell}>Value</Text>
									<Text style={styles.tableCellLast}>Change</Text>
								</View>
								<View style={[styles.tableRow, styles.tableRowAlternate]}>
									<Text style={styles.tableCell}>Total Users</Text>
									<Text style={styles.tableCell}>{stats.totalUsers}</Text>
									<Text style={styles.tableCellLast}>128 new this month (+12%)</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>Total Mentors</Text>
									<Text style={styles.tableCell}>{stats.totalMentors}</Text>
									<Text style={styles.tableCellLast}>24 new this month (-8%)</Text>
								</View>
								<View style={[styles.tableRow, styles.tableRowAlternate]}>
									<Text style={styles.tableCell}>Sessions Conducted</Text>
									<Text style={styles.tableCell}>{stats.totalSessions}</Text>
									<Text style={styles.tableCellLast}>9 scheduled today (+23%)</Text>
								</View>
								<View style={styles.tableRow}>
									<Text style={styles.tableCell}>Total Revenue</Text>
									<Text style={styles.tableCell}>₹{stats.totalRevenue.toLocaleString()}</Text>
									<Text style={styles.tableCellLast}>₹5,231 this month (+4%)</Text>
								</View>
							</View>
						</View>

						{/* Platform Metrics */}
						<View style={styles.section}>
							<Text style={styles.sectionTitle}>Platform Metrics</Text>
							<View style={styles.table}>
								<View style={[styles.tableRow, styles.tableHeader]}>
									<Text style={styles.tableCell}>Metric</Text>
									<Text style={styles.tableCellLast}>Value</Text>
								</View>
								{metrics.map((metric, idx) => (
									<View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlternate : {}]}>
										<Text style={styles.tableCell}>{metric.title}</Text>
										<Text style={styles.tableCellLast}>{metric.value}</Text>
									</View>
								))}
							</View>
						</View>
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer} fixed>
					<Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
					<Text>Contact: support@mentoringplatform.com</Text>
				</View>
			</Page>

			{/* Page 2: Top Mentors, Revenue Overview, User Growth */}
			<Page size="A4" style={styles.page}>
				{/* Header */}
				<View style={styles.header} fixed>
					<Image style={styles.logoPlaceholder} src={logo} />
					<Text style={styles.title}>Platform Analytics Report</Text>
				</View>

				{/* Top Mentors */}
				<View style={styles.section}>
					<Text style={styles.subSectionTitle}>Top Mentors</Text>
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={styles.tableCell}>Name</Text>
							<Text style={styles.tableCell}>Sessions</Text>
							<Text style={styles.tableCell}>Rating</Text>
							<Text style={styles.tableCellLast}>Revenue (₹)</Text>
						</View>
						{topMentors.map((mentor, idx) => (
							<View key={mentor.id} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlternate : {}]}>
								<Text style={styles.tableCell}>{mentor.name}</Text>
								<Text style={styles.tableCell}>{mentor.sessions}</Text>
								<Text style={styles.tableCell}>{mentor.rating.toFixed(1)}</Text>
								<Text style={styles.tableCellLast}>₹{mentor.revenue.toLocaleString()}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Revenue Overview */}
				<View style={styles.section}>
					<Text style={styles.subSectionTitle}>Revenue Overview ({revenueFilter})</Text>
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={styles.tableCell}>Month</Text>
							<Text style={styles.tableCellLast}>Revenue (₹)</Text>
						</View>
						{revenue.map((data, idx) => (
							<View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlternate : {}]}>
								<Text style={styles.tableCell}>{data.name}</Text>
								<Text style={styles.tableCellLast}>₹{data.total.toLocaleString()}</Text>
							</View>
						))}
					</View>
				</View>

				{/* User Growth */}
				<View style={styles.section}>
					<Text style={styles.subSectionTitle}>User Growth ({userGrowthFilter})</Text>
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={styles.tableCell}>Month</Text>
							<Text style={styles.tableCell}>Users</Text>
							<Text style={styles.tableCellLast}>Mentors</Text>
						</View>
						{userGrowth.map((data, idx) => (
							<View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlternate : {}]}>
								<Text style={styles.tableCell}>{data.name}</Text>
								<Text style={styles.tableCell}>{data.users}</Text>
								<Text style={styles.tableCellLast}>{data.mentors}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Footer */}
				<View style={styles.footer} fixed>
					<Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
					<Text>Contact: support@mentoringplatform.com</Text>
				</View>
			</Page>
		</Document>
	);
};

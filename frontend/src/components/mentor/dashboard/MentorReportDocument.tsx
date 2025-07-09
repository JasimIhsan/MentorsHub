import { Document, Page, Text, View, StyleSheet, Image, Font } from "@react-pdf/renderer";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { IReviewDTO } from "@/interfaces/review.dto";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

// Import the logo image
import logo from "@/assets/MentorsHub logo image.jpg";

// Register Noto Sans font to support the rupee symbol
Font.register({
	// family: "Winky Sans",
	// src: "https://fonts.gstatic.com/s/Winky Sans/v28/o-0IIpQlx3QUlC5A4PNr5TRASf6M7Q.ttf", // Noto Sans Regular

	family: "Winky Sans",
	src: "/fonts/WinkySans-Regular.ttf",
	fontWeight: "normal",
	fontStyle: "normal",
});

// Alternatively, if using a local font file:
// Font.register({
//   family: "Winky Sans",
//   src: require("@/assets/fonts/Winky Sans-Regular.ttf"),
// });

const styles = StyleSheet.create({
	page: {
		padding: 40,
		fontSize: 10,
		fontFamily: "Winky Sans", // Updated to Winky Sans
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
	bold: {
		fontWeight: "bold",
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

interface ChartData {
	name: string;
	averageRating: number;
}

interface PerformanceData {
	week: string;
	sessions: number;
	revenue: number;
}

interface MentorReportDocumentProps {
	stats: {
		upcomingSessions: number;
		pendingRequests: number;
		averageRating: number;
		revenue: number;
	};
	sessions: ISessionMentorDTO[];
	requests: ISessionMentorDTO[];
	reviews: IReviewDTO[];
	ratingsData: ChartData[];
	performanceData: PerformanceData[];
	filterPerformancePeriod: string;
	filterRatingsPeriod: string;
	mentorName: string;
	mentorEmail: string;
	generatedDate: string;
}

export const MentorReportDocument = ({ stats, sessions, requests, reviews, ratingsData, performanceData, filterPerformancePeriod, filterRatingsPeriod, mentorName, mentorEmail, generatedDate }: MentorReportDocumentProps) => (
	<Document>
		{/* Page 1: Mentor Info, Sidebar, Sessions, Requests, Reviews */}
		<Page size="A4" style={styles.page}>
			{/* Header */}
			<View style={styles.header} fixed>
				<Image style={styles.logoPlaceholder} src={logo} />
				<Text style={styles.title}>Mentor Summary Report</Text>
			</View>

			{/* Main Content with Sidebar */}
			<View style={{ flexDirection: "row" }}>
				{/* Sidebar */}
				<View style={styles.sidebar}>
					<Text style={styles.sidebarTitle}>Quick Stats</Text>
					<Text style={styles.sidebarText}>Upcoming Sessions: {stats.upcomingSessions}</Text>
					<Text style={styles.sidebarText}>Pending Requests: {stats.pendingRequests}</Text>
					<Text style={styles.sidebarText}>Average Rating: {stats.averageRating.toFixed(1)} ★</Text>
					<Text style={styles.sidebarText}>Total Revenue: ₹{stats.revenue.toLocaleString()}</Text>
				</View>

				{/* Content */}
				<View style={styles.content}>
					{/* Mentor Info */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Mentor Information</Text>
						<Text style={styles.text}>Mentor: {mentorName}</Text>
						<Text style={styles.text}>Email: {mentorEmail}</Text>
						<Text style={styles.text}>Generated Date: {generatedDate}</Text>
					</View>

					{/* Upcoming Sessions */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Upcoming Sessions</Text>
						{sessions.length === 0 ? (
							<Text style={styles.text}>No upcoming sessions</Text>
						) : (
							sessions.map((s, idx) => (
								<Text key={idx} style={styles.text}>
									• {s.topic} on {formatTime(s.time)} in {formatDate(s.date)}
								</Text>
							))
						)}
					</View>

					{/* Pending Requests */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Pending Requests</Text>
						{requests.length === 0 ? (
							<Text style={styles.text}>No pending requests</Text>
						) : (
							requests.map((r, idx) => (
								<Text key={idx} style={styles.text}>
									• {r.topic} from {r.participants?.length ?? 0} participant(s)
								</Text>
							))
						)}
					</View>

					{/* Recent Reviews */}
					<View style={styles.section}>
						<Text style={styles.sectionTitle}>Recent Reviews</Text>
						{reviews.length === 0 ? (
							<Text style={styles.text}>No reviews yet</Text>
						) : (
							reviews.slice(0, 5).map((review, idx) => (
								<Text key={idx} style={styles.text}>
									★ {review.rating} - {review.comment?.slice(0, 60)}...
								</Text>
							))
						)}
					</View>
				</View>
			</View>

			{/* Footer */}
			<View style={styles.footer} fixed>
				<Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
				<Text>Contact: support@mentoringplatform.com</Text>
			</View>
		</Page>

		{/* Page 2: Rating Performance and Plan Performance Tables */}
		<Page size="A4" style={styles.page}>
			{/* Header */}
			<View style={styles.header} fixed>
				<Image style={styles.logoPlaceholder} src={logo} />
				<Text style={styles.title}>Mentor Summary Report</Text>
			</View>

			{/* Rating Performance Table */}
			<View style={styles.section}>
				<Text style={styles.subSectionTitle}>Rating Performance ({filterRatingsPeriod})</Text>
				{ratingsData.length === 0 ? (
					<Text style={styles.text}>No rating data available</Text>
				) : (
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={styles.tableCell}>Period</Text>
							<Text style={styles.tableCellLast}>Average Rating (★)</Text>
						</View>
						{ratingsData.map((data, idx) => (
							<View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlternate : {}]}>
								<Text style={styles.tableCell}>{data.name}</Text>
								<Text style={styles.tableCellLast}>{data.averageRating.toFixed(1)}</Text>
							</View>
						))}
					</View>
				)}
			</View>

			{/* Plan Performance Table */}
			<View style={styles.section}>
				<Text style={styles.subSectionTitle}>Plan Performance ({filterPerformancePeriod})</Text>
				{performanceData.length === 0 ? (
					<Text style={styles.text}>No performance data available</Text>
				) : (
					<View style={styles.table}>
						<View style={[styles.tableRow, styles.tableHeader]}>
							<Text style={styles.tableCell}>Period</Text>
							<Text style={styles.tableCell}>Sessions</Text>
							<Text style={styles.tableCellLast}>Revenue (₹)</Text>
						</View>
						{performanceData.map((data, idx) => (
							<View key={idx} style={[styles.tableRow, idx % 2 === 1 ? styles.tableRowAlternate : {}]}>
								<Text style={styles.tableCell}>{data.week}</Text>
								<Text style={styles.tableCell}>{data.sessions}</Text>
								<Text style={styles.tableCellLast}>{data.revenue.toLocaleString()}</Text>
							</View>
						))}
					</View>
				)}
			</View>

			{/* Footer */}
			<View style={styles.footer} fixed>
				<Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
				<Text>Contact: support@mentoringplatform.com</Text>
			</View>
		</Page>
	</Document>
);

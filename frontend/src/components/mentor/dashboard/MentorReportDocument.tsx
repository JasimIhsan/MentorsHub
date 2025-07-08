import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { IReviewDTO } from "@/interfaces/review.dto";
import { formatDate, formatTime } from "@/utility/time-data-formatter";

const styles = StyleSheet.create({
	page: { padding: 30, fontSize: 12 },
	section: { marginBottom: 20 },
	heading: { fontSize: 16, marginBottom: 5, fontWeight: "bold" },
	text: { marginBottom: 2 },
	bold: { fontWeight: "bold" },
	line: { borderBottom: "1 solid #ccc", marginVertical: 8 },
});

export const MentorReportDocument = ({
	stats,
	sessions,
	requests,
	reviews,
}: {
	stats: {
		upcomingSessions: number;
		pendingRequests: number;
		averageRating: number;
		revenue: number;
	};
	sessions: ISessionMentorDTO[];
	requests: ISessionMentorDTO[];
	reviews: IReviewDTO[];
}) => (
	<Document>
		<Page size="A4" style={styles.page}>
			<View style={styles.section}>
				<Text style={styles.heading}>Mentor Summary Report</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.bold}>Overview:</Text>
				<Text style={styles.text}>Upcoming Sessions: {stats.upcomingSessions}</Text>
				<Text style={styles.text}>Pending Requests: {stats.pendingRequests}</Text>
				<Text style={styles.text}>Average Rating: {stats.averageRating.toFixed(1)} ★</Text>
				<Text style={styles.text}>Total Revenue: ₹{stats.revenue.toLocaleString()}</Text>
			</View>

			<View style={styles.section}>
				<Text style={styles.bold}>Upcoming Sessions:</Text>
				{sessions.length === 0 ? (
					<Text>No upcoming sessions</Text>
				) : (
					sessions.map((s, idx) => (
						<Text key={idx} style={styles.text}>
							• {s.topic} on {formatTime(s.time)} in {formatDate(s.date)}
						</Text>
					))
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.bold}>Pending Requests:</Text>
				{requests.length === 0 ? (
					<Text>No pending requests</Text>
				) : (
					requests.map((r, idx) => (
						<Text key={idx} style={styles.text}>
							• {r.topic} from {r.participants?.length ?? 0} participant(s)
						</Text>
					))
				)}
			</View>

			<View style={styles.section}>
				<Text style={styles.bold}>Recent Reviews:</Text>
				{reviews.length === 0 ? (
					<Text>No reviews yet</Text>
				) : (
					reviews.slice(0, 5).map((review, idx) => (
						<Text key={idx} style={styles.text}>
							★ {review.rating} - {review.comment?.slice(0, 60)}...
						</Text>
					))
				)}
			</View>
		</Page>
	</Document>
);

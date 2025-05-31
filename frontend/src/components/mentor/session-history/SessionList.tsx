import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { SessionCard } from "./SessionCard";
import { SessionCardSkeleton } from "./SessionSkeleton";

interface SessionListProps {
	sessions: ISessionMentorDTO[];
	onSelectSession: (session: ISessionMentorDTO) => void;
	isLoading: boolean;
}

export function SessionList({ sessions, onSelectSession, isLoading }: SessionListProps) {
	if (isLoading) {
		return (
			<div className="space-y-6">
				{[...Array(5)].map((_, index) => (
					<SessionCardSkeleton key={index} />
				))}
			</div>
		);
	}

	if (sessions.length === 0) {
		return (
			<div className="text-center p-4">
				<p className="text-sm text-gray-500">No sessions found for the selected filter.</p>
			</div>
		);
	}

	return (
		<div className="space-y-6">
			{sessions.map((session) => (
				<SessionCard key={session.id} session={session} onSelect={onSelectSession} />
			))}
		</div>
	);
}

// components/sessions/SessionList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";
import { SessionCard } from "./SessionCard";

interface SessionListProps {
	sessions: ISessionMentorDTO[];
	onStartSession: (sessionId: string) => void;
	setSelectedSession: (session: ISessionMentorDTO) => void;
	handleUpdateSession: (sessionId: string) => void;
}

export function SessionList({ sessions, onStartSession, setSelectedSession, handleUpdateSession }: SessionListProps) {
	return (
		<Card className="p-0 border-none bg-background shadow-none">
			<CardContent className="p-0">
				<div className="space-y-6">
					{sessions.map((session) => (
						<SessionCard key={session.id} session={session} onStartSession={() => onStartSession(session.id)} setSelectedSession={setSelectedSession} handleUpdateSession={handleUpdateSession} />
					))}
					{sessions.length === 0 && (
						<div className="text-center p-4">
							<p className="text-sm text-muted-foreground">No sessions found for the selected filter.</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

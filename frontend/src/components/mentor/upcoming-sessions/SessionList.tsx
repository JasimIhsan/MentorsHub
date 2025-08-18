// components/sessions/SessionList.tsx
import { Card, CardContent } from "@/components/ui/card";
import { ISessionMentorDTO } from "@/interfaces/session.interface";
import { SessionCard } from "./SessionCard";

interface SessionListProps {
	sessions: ISessionMentorDTO[];
	onStartSession: (sessionId: string) => void;
	// setSelectedSession: (session: ISessionMentorDTO) => void;
	handleUpdateSession: (sessionId: string) => void;
}

export function SessionList({ sessions, onStartSession, handleUpdateSession }: SessionListProps) {
	return (
		<Card className="p-0 border-none bg-background shadow-none">
			<CardContent className="p-0">
				<div className="space-y-6">
					{sessions.map((session) => (
						<SessionCard key={session.id} session={session} onStartSession={() => onStartSession(session.id)} handleUpdateSession={handleUpdateSession} />
					))}
					{sessions.length === 0 && (
						<div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
							{/* Icon */}
							<div className="mb-6">
								<svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
							</div>

							{/* Message */}
							<h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">No Upcoming Sessions</h2>
							<p className="text-sm sm:text-base text-gray-500 max-w-md mb-6">It looks like there are no upcoming sessions at the moment. Check back later or explore your scheduled sessions.</p>

							{/* Call to Action Buttons */}
							{/* <div className="flex flex-col sm:flex-row gap-3">
								<Button variant="default">View All Sessions</Button>
								<Button variant="outline">Schedule New Session</Button>
							</div> */}
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}

// components/sessions/SessionActions.tsx
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { Alert } from "@/components/custom/alert";
import { ISessionMentorDTO } from "@/interfaces/ISessionDTO";

interface SessionActionsProps {
	session: ISessionMentorDTO;
	onStartSession: () => void;
	handleUpdateSession: (sessionId: string) => void;
	setSelectedSession: (session: ISessionMentorDTO) => void;
}

export default function SessionActions({ session, onStartSession, handleUpdateSession, setSelectedSession }: SessionActionsProps) {
	return (
		<>
			{session.status === "upcoming" && (
				<div className="flex flex-col gap-2">
					<Button onClick={onStartSession} className="w-full md:w-auto">
						Start Session
					</Button>
					<Alert
						triggerElement={
							<Button variant="outline" className="w-full md:w-auto">
								Mark as Completed
							</Button>
						}
						contentTitle="Are you sure?"
						contentDescription="This action will mark the session as completed. You can't undo this."
						actionText="Yes, mark it"
						onConfirm={() => handleUpdateSession(session.id)}
					/>
				</div>
			)}
			<Button variant="ghost" size="icon" onClick={() => setSelectedSession(session)}>
				<FileText className="h-4 w-4" />
			</Button>
		</>
	);
}

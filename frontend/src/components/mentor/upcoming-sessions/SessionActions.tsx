import { Button } from '@/components/ui/button';
import { Alert } from '@/components/custom/alert';
import { ISessionMentorDTO } from '@/interfaces/session.interface';

interface SessionActionsProps {
   session: ISessionMentorDTO;
   onStartSession: () => void;
   handleUpdateSession: (sessionId: string) => void;
   // setSelectedSession: (session: ISessionMentorDTO) => void;
}

export default function SessionActions({ session, onStartSession, handleUpdateSession }: SessionActionsProps) {
   return (
      <>
         {session.status === 'upcoming' && (
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
      </>
   );
}

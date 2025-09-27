// components/sessions/SessionCard.tsx
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Clock, Video, IndianRupee } from 'lucide-react';
import { ISessionMentorDTO } from '@/interfaces/session.interface';
import SessionActions from './SessionActions';
import { useNavigate } from 'react-router-dom';

interface SessionCardProps {
   session: ISessionMentorDTO;
   onStartSession: () => void;
   // setSelectedSession: (session: ISessionMentorDTO) => void;
   handleUpdateSession: (sessionId: string) => void;
}

export function SessionCard({ session, onStartSession, handleUpdateSession }: SessionCardProps) {
   const navigate = useNavigate();
   const formatTime = (time: string) => {
      const [hour, minute] = time.split(':').map(Number);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minute.toString().padStart(2, '0')} ${ampm}`;
   };

   const handleNavigateSessionPage = () => {
      navigate(`/mentor/session-details/${session.id}`);
   };

   return (
      <Card className="overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
         <CardContent>
            {/* LEFT: Session Title */}
            <div className="col-span-4">
               <h1 className="font-semibold text-xl text-primary cursor-pointer hover:underline" onClick={handleNavigateSessionPage}>
                  {session.topic}
               </h1>
            </div>
            <div className="grid grid-cols-12 items-center gap-4 ">
               {/* CENTER: Date, Time, Format, Pricing */}
               <div className="col-span-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                     <CalendarDays className="h-4 w-4 text-muted-foreground" />
                     <span>{new Date(session.date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <span>
                        {`${formatTime(session.startTime)} - ${formatTime(session.endTime)}`} ({session.hours} hrs)
                     </span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Video className="h-4 w-4 text-muted-foreground" />
                     <span>{session.sessionFormat}</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <IndianRupee className="h-4 w-4 text-muted-foreground" />
                     <span>{session.pricing === 'free' ? 'Free' : session.totalAmount?.toFixed(2) || 0}</span>
                  </div>
               </div>

               {/* RIGHT: Status + Actions */}
               <div className="col-span-6 flex items-center justify-end gap-3">
                  <div className="flex flex-col items-end gap-2">
                     <Badge variant={session.status === 'completed' ? 'outline' : 'default'} className={`capitalize ${session.status === 'completed' ? 'bg-primary/10 text-primary' : 'bg-primary text-primary-foreground'}`}>
                        {session.status}
                     </Badge>
                     {session.rescheduleRequest && (
                        <Badge variant="outline" className={`capitalize ${session.rescheduleRequest.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : session.rescheduleRequest.status === 'accepted' ? 'bg-green-100 text-green-800' : session.rescheduleRequest.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                           Reschedule {session.rescheduleRequest.status}
                        </Badge>
                     )}
                  </div>
                  <SessionActions session={session} onStartSession={onStartSession} handleUpdateSession={handleUpdateSession} />
               </div>
            </div>
         </CardContent>
      </Card>
   );
}

interface SessionCalendarViewProps {
	view: "day" | "week" | "month" | "agenda"
 }
 
 export function SessionCalendarView({ view }: SessionCalendarViewProps) {
	// This is a placeholder component
	// In a real implementation, you would use a library like FullCalendar
 
	// For the wireframe, we'll just show a placeholder for each view
 
	return (
	  <div className="p-6 min-h-[600px]">
		 {view === "day" && <DayView />}
		 {/* {view === "week" && <WeekView />} */}
		 {view === "month" && <MonthView />}
		 {view === "agenda" && <AgendaView />}
	  </div>
	)
 }
 
 function DayView() {
	const hours = Array.from({ length: 12 }, (_, i) => i + 8) // 8 AM to 7 PM
 
	return (
	  <div className="space-y-4">
		 <h3 className="font-medium">Wednesday, July 17, 2024</h3>
 
		 <div className="space-y-2">
			{hours.map((hour) => (
			  <div key={hour} className="grid grid-cols-12 gap-2">
				 <div className="col-span-1 text-right text-sm text-muted-foreground">{hour}:00</div>
				 <div className="col-span-11 border-l pl-2 min-h-[60px] relative">
					{hour === 10 && (
					  <div className="absolute top-0 left-2 right-2 bg-primary/10 border border-primary/20 rounded-md p-2 h-[58px]">
						 <div className="font-medium text-sm">Maria Garcia</div>
						 <div className="text-xs text-muted-foreground">JavaScript Advanced Concepts</div>
					  </div>
					)}
					{hour === 14 && (
					  <div className="absolute top-0 left-2 right-2 bg-muted border border-muted-foreground/20 rounded-md p-2 h-[58px]">
						 <div className="font-medium text-sm">Alex Johnson (Pending)</div>
						 <div className="text-xs text-muted-foreground">React Fundamentals</div>
					  </div>
					)}
				 </div>
			  </div>
			))}
		 </div>
	  </div>
	)
 }
 
//  function WeekView() {
// 	const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
// 	const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17]
 
// 	// Sample events
// 	const\
//  }
 
 function MonthView() {
	return (
	  <div>
		 <h3>Month View</h3>
		 <p>Placeholder for the month view.</p>
	  </div>
	)
 }
 
 function AgendaView() {
	return (
	  <div>
		 <h3>Agenda View</h3>
		 <p>Placeholder for the agenda view.</p>
	  </div>
	)
 }
 
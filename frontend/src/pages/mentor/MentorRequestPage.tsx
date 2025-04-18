import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SessionRequestsList } from "@/components/mentor/requests/SessionRequestList";
import { Search, Filter } from "lucide-react";

export function MentorRequestsPage() {
	return (
		<div className="space-y-6">
			<div className="flex flex-col md:flex-row justify-between gap-4">
				<div>
					<h1 className="text-3xl font-bold tracking-tight">Session Requests</h1>
					<p className="text-muted-foreground">Review and manage incoming session requests</p>
				</div>
			</div>

			<Tabs defaultValue="pending" className="space-y-4">
				<div className="flex flex-col sm:flex-row justify-between gap-4">
					<TabsList>
						<TabsTrigger value="pending">Pending (4)</TabsTrigger>
						<TabsTrigger value="approved">Approved (2)</TabsTrigger>
						<TabsTrigger value="rejected">Rejected (1)</TabsTrigger>
					</TabsList>

					<div className="flex items-center gap-2">
						<div className="relative">
							<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
							<Input type="search" placeholder="Search requests..." className="w-full sm:w-[200px] pl-8 bg-background" />
						</div>

						<Select defaultValue="all">
							<SelectTrigger className="w-[130px]">
								<Filter className="h-4 w-4 mr-2" />
								<SelectValue placeholder="Filter" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Requests</SelectItem>
								<SelectItem value="today">Today</SelectItem>
								<SelectItem value="week">This Week</SelectItem>
								<SelectItem value="premium">Premium Only</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<TabsContent value="pending" className="space-y-4">
					<SessionRequestsList status="pending" />
				</TabsContent>

				<TabsContent value="approved" className="space-y-4">
					<SessionRequestsList status="approved" />
				</TabsContent>

				<TabsContent value="rejected" className="space-y-4">
					<SessionRequestsList status="rejected" />
				</TabsContent>
			</Tabs>
		</div>
	);
}

import { DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose, Drawer } from "@/components/ui/drawer";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface JoinRequestDrawerProps {
	isOpen: boolean;
	onClose: () => void;
	joinRequests: { userId: string; sessionId: string; peerId: string; name: string; avatar?: string }[];
	onApprove: (request: { userId: string; sessionId: string; peerId: string; name: string }) => void;
	onReject: (request: { userId: string; sessionId: string; peerId: string; name: string }) => void;
}

export const JoinRequestDrawer = ({ isOpen, onClose, joinRequests, onApprove, onReject }: JoinRequestDrawerProps) => {
	return (
		<Drawer open={isOpen} onClose={onClose} direction="right">
			<DrawerContent className="w-[400px] h-full fixed right-0 top-0">
				<DrawerHeader>
					<DrawerTitle>Join Requests</DrawerTitle>
				</DrawerHeader>
				<div className="p-4 space-y-4 overflow-auto flex-1">
					{joinRequests.length === 0 ? (
						<p className="text-center text-sm text-gray-400">No pending requests.</p>
					) : (
						joinRequests.map((request) => (
							<div key={request.userId} className="flex items-center justify-between p-2 border-b">
								<div className="flex items-center gap-2">
									<Avatar className="h-8 w-8">
										<AvatarImage src={request.avatar} />
										<AvatarFallback>{request.name[0]}</AvatarFallback>
									</Avatar>
									<p className="text-sm font-medium">{request.name}</p>
								</div>
								<div className="flex gap-2">
									<Button size="sm" onClick={() => onApprove(request)}>
										Approve
									</Button>
									<Button size="sm" variant="destructive" onClick={() => onReject(request)}>
										Reject
									</Button>
								</div>
							</div>
						))
					)}
				</div>
				<DrawerFooter>
					<DrawerClose asChild>
						<Button variant="outline" onClick={onClose}>
							Close
						</Button>
					</DrawerClose>
				</DrawerFooter>
			</DrawerContent>
		</Drawer>
	);
};

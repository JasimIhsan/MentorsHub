import { Badge } from "@/components/ui/badge";

export function RoleBadge({ role }: { role: string }) {
	switch (role) {
		case "admin":
			return (
				<Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">
					Admin
				</Badge>
			);
		case "mentor":
			return (
				<Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
					Mentor
				</Badge>
			);
		default:
			return (
				<Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
					User
				</Badge>
			);
	}
}

export function StatusBadge({ status }: { status: string }) {
	switch (status) {
		case "unblocked":
			return (
				<Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
					Unblocked
				</Badge>
			);
		case "blocked":
			return (
				<Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">
					Blocked
				</Badge>
			);
		default:
			return (
				<Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
					Unknown
				</Badge>
			);
	}
}

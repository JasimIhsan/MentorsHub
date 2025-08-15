import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
	status: "pending" | "approved" | "rejected" | "not-requested";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
	const map: Record<string, { label: string; color: string }> = {
		pending: { label: "Pending", color: "bg-blue-50 text-blue-600 border-blue-200" },
		approved: { label: "Approved", color: "bg-green-50 text-green-600 border-green-200" },
		rejected: { label: "Rejected", color: "bg-red-50 text-red-600 border-red-200" },
		"not-requested": { label: "Not Requested", color: "bg-gray-50 text-gray-600 border-gray-200" },
	};

	return (
		<Badge variant="outline" className={map[status]?.color}>
			{map[status]?.label || "Unknown"}
		</Badge>
	);
}

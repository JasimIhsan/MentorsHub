import { Alert, AlertDescription } from "@/components/ui/alert";

export function WalletNotification({ notification }: { notification: { type: "success" | "error"; message: string } | null }) {
	if (!notification) return null;
	return (
		<Alert className={`${notification.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}>
			<AlertDescription className={notification.type === "success" ? "text-green-800" : "text-red-800"}>{notification.message}</AlertDescription>
		</Alert>
	);
}

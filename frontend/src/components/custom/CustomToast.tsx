import { toast } from "sonner";
import { BellRing, CheckCircle, Info, AlertCircle, AlertTriangle } from "lucide-react";
import { formatRelativeTime } from "@/utility/format-relative-time";

interface NotificationPayload {
	title: string;
	message: string;
	type: "success" | "error" | "info" | "warning" | "reminder";
	link?: string;
	createdAt: Date;
}

// Helper function to trigger toast notification
export function notify(payload: NotificationPayload) {
	toast.custom((t) => <ToastNotification payload={payload} toastId={t} />);
}

interface ToastNotificationProps {
	payload: NotificationPayload;
	toastId: string | number;
}

export function ToastNotification({ payload, toastId }: ToastNotificationProps) {
	console.log('payload: ', payload);
	// Calculate relative time
	const relativeTime = formatRelativeTime(payload.createdAt);

	// Map notification type to icon and styles
	const typeStyles = {
		success: { icon: <CheckCircle className="w-5 h-5" />, borderColor: "border-green-500" },
		error: { icon: <AlertCircle className="w-5 h-5" />, borderColor: "border-red-500" },
		info: { icon: <Info className="w-5 h-5" />, borderColor: "border-blue-500" },
		warning: { icon: <AlertTriangle className="w-5 h-5" />, borderColor: "border-yellow-500" },
		reminder: { icon: <BellRing className="w-5 h-5" />, borderColor: "border-purple-500" },
	};

	const { icon, borderColor } = typeStyles[payload.type];

	return (
		<div className={`flex items-start p-4 bg-white dark:bg-gray-800 border-l-4 ${borderColor} rounded-md shadow-md max-w-sm w-full`} role="alert" aria-labelledby={`toast-title-${toastId}`} aria-describedby={`toast-message-${toastId}`}>
			<div className="flex-shrink-0 mr-3">{icon}</div>
			<div className="flex-1">
				<h3 id={`toast-title-${toastId}`} className="font-bold text-gray-900 dark:text-white">
					{payload.title}
				</h3>
				<p id={`toast-message-${toastId}`} className="text-sm text-gray-600 dark:text-gray-300">
					{payload.message}
				</p>
				<div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{relativeTime}</div>
				{payload.link && (
					<a href={payload.link} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300" aria-label={`View details for ${payload.title}`}>
						View
					</a>
				)}
			</div>
			<button onClick={() => toast.dismiss(toastId)} className="ml-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" aria-label="Close notification">
				×
			</button>
		</div>
	);
}

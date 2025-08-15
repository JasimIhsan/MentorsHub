import { INotification } from "@/interfaces/notification.interface";
import { addNotification } from "@/store/slices/notificationSlice";
import { toast } from "sonner";
import { NavigateFunction } from "react-router-dom";
import { AppDispatch } from "@/store/store"; // adjust if needed

export const handleIncomingNotification = (notification: INotification, dispatch: AppDispatch, navigate: NavigateFunction) => {
	// adding notification to redux
	if (notification.id) dispatch(addNotification(notification));

	toast(notification.title, {
		description: notification.message,
		className: "text-black border border-gray-200 shadow-lg rounded-lg bg-white",
		descriptionClassName: "text-sm !text-gray-600 mt-1",
		position: "top-center",
		action: notification.link
			? {
					label: "View",
					onClick: () => navigate(notification.link!),
			  }
			: undefined,
		actionButtonStyle: {
			backgroundColor: "#112d4e",
			color: "white",
			borderRadius: "0.375rem",
			padding: "0.25rem 0.75rem",
			fontSize: "0.875rem",
		},
		duration: 5000,
		style: {
			animation: "slideIn 0.3s ease-out, slideOut 0.3s ease-in 3.7s forwards",
		},
	});
};

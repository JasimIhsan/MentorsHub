import { CircleCheckBig, CircleX, Info, CircleAlert, Bell } from "lucide-react";

export const getIcon = (type: "success" | "error" | "info" | "warning" | "reminder") => {
	switch (type) {
		case "success":
			return <CircleCheckBig className="w-5 h-5 text-green-500" />;
		case "error":
			return <CircleX className="w-5 h-5 text-red-500" />;
		case "info":
			return <Info className="w-5 h-5 text-blue-500" />;
		case "warning":
			return <CircleAlert className="w-5 h-5 text-yellow-500" />;
		case "reminder":
			return <Bell className="w-5 h-5 text-purple-500" />;
		default:
			return null;
	}
};

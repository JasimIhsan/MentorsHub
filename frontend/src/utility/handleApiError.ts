import { toast } from "sonner";

export const handleAPIError = (error: Error) => {
	console.log(error);
	toast.error(error.message);
};

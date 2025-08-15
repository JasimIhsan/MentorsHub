import axiosInstance from "@/api/config/api.config";
import { extractDocumentName } from "./extractDocumentName";

export const downloadFromS3Key = async (key: string) => {
	try {
		const response = await axiosInstance.get(`/documents/download-document?key=${encodeURIComponent(key)}`, {
			responseType: "blob",
		});

		const blob = new Blob([response.data]);
		const downloadUrl = window.URL.createObjectURL(blob);

		const a = document.createElement("a");
		a.href = downloadUrl;
		a.download = extractDocumentName(key) as string;
		document.body.appendChild(a);
		a.click();
		a.remove();

		window.URL.revokeObjectURL(downloadUrl);
	} catch (error) {
		console.error("Download failed:", error);
		throw new Error("Unable to download the document.");
	}
};

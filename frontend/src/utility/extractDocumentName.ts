export const extractDocumentName = (url: string) => {
	const lastName = url.split("/").pop()?.split("?")[0];
	const decodedName = decodeURIComponent(lastName || "Unnamed Document");
	const file = decodedName.split("-").pop();
	return file;
};

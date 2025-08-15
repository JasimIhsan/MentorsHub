export const getUniqueKey = (item: any, index: number): string => {
	if (typeof item === "string") return `${item}-${index}`;
	if (item && typeof item === "object") {
		return `obj-${index}-${JSON.stringify(item).replace(/[^a-zA-Z0-9]/g, "")}`;
	}
	return `item-${index}`;
};

export const renderItem = (item: any): string => {
	if (typeof item === "string") return item;
	if (item && typeof item === "object") {
		return JSON.stringify(item);
	}
	return "Unknown";
};

export interface ISendMessageDTO {
	id: string;
	chatId: string;
	sender: {
		id: string;
		firstName: string;
		lastName: string;
		avatar?: string;
	};
	content: string;
	type: "text" | "image" | "file" | "video"; 
	fileUrl?: string;
	readBy: string[]; // array of user IDs who have read this message
	createdAt: Date;
	updatedAt: Date;
}

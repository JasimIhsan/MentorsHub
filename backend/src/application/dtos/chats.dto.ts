export interface IUserSummaryDTO {
	id: string;
	firstName: string;
	lastName: string;
	avatar?: string;
}

export interface IMessageSummaryDTO {
	id: string;
	content: string;
	type: string;
	sender: IUserSummaryDTO;
	createdAt: Date;
}

export interface IChatDTO {
	id: string;
	isGroupChat: boolean;
	name?: string;
	participants: IUserSummaryDTO[];
	groupAdmin?: IUserSummaryDTO;
	lastMessage?: IMessageSummaryDTO;
	createdAt: Date;
	updatedAt: Date;
}

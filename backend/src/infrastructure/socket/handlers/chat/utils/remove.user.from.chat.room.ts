import { chatRooms } from "../../../context";

export function removeUserFromChatRooms(socketId: string) {
	for (const [chatId, participants] of chatRooms.entries()) {
		const updated = participants.filter((p) => p.socketId !== socketId);
		if (updated.length === 0) {
			chatRooms.delete(chatId); // No one left in the room
		} else {
			chatRooms.set(chatId, updated);
		}
	}
}

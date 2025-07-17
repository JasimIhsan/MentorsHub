import { chatRooms, ChatParticipant } from "../../../context";

export function joinChatRoom(chatId: string, participant: ChatParticipant) {
	const existing = chatRooms.get(chatId) || [];
	const isAlreadyJoined = existing.find((p) => p.userId === participant.userId);

	if (!isAlreadyJoined) {
		existing.push(participant);
		chatRooms.set(chatId, existing);
	}
}

import { Server, Socket } from "socket.io";
import { deleteMessageUseCase } from "../../../application/usecases/text-message/composer";

export const deleteMessageHandler = (io: Server, socket: Socket) => {
	socket.on("delete-message", async (data) => {
		const { messageId, chatId, senderId } = data;

		try {
			const deletedId = await deleteMessageUseCase.execute({ messageId, chatId, senderId });
			console.log(`message deleted ✅ `, );
			// notify other clients that the message deleted
			io.to(`chat_${chatId}`).emit("message-deleted", { messageId: deletedId });
		} catch (err: any) {
			console.error("Delete error:", err.message);
		}
	});
};

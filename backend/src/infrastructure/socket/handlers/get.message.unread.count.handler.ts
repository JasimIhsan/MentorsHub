import { Server, Socket } from "socket.io";
import { getMessageUnreadCountsByUser } from "../../../application/usecases/text-message/composer";

export const getMessageUnreadCountHandler = (io: Server, socket: Socket) => {
	socket.on("get-unread-counts", async ({ userId, chatIds }: { userId: string; chatIds: string[] }) => {
		try {
			console.log(`🔄️📖🔄️📖 get-unread-counts: userId=${userId}, chatIds=${chatIds}`);
			const counts = await getMessageUnreadCountsByUser.execute(userId, chatIds);
			console.log('counts of unread message of each chats: ', counts);
			socket.emit("unread-counts-response", counts);
		} catch (err) {
			console.error(err);
			socket.emit("unread-counts-error", { message: "Something went wrong" });
		}
	});
};

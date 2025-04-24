// // import { Room, RoomEntity } from "../../../domain/entities/room.entity";
// import { UserInterface } from "../../../domain/entities/user.entity";

// export interface RoomRepository {
// 	getRoom(roomId: string): Room | undefined;
// 	createRoom(roomId: string): Room;
// 	addUserToRoom(roomId: string, user: UserInterface): void;
// 	removeUserFromRoom(roomId: string, userId: string): void;
// 	getUsersInRoom(roomId: string): UserInterface[];
// }

// export class RoomUseCases {
// 	private roomRepository: RoomRepository;

// 	constructor(roomRepository: RoomRepository) {
// 		this.roomRepository = roomRepository;
// 	}

// 	joinRoom(roomId: string, user: UserInterface): UserInterface[] {
// 		let room = this.roomRepository.getRoom(roomId);
// 		if (!room) {
// 			room = this.roomRepository.createRoom(roomId);
// 		}
// 		this.roomRepository.addUserToRoom(roomId, user);
// 		return this.roomRepository.getUsersInRoom(roomId);
// 	}

// 	leaveRoom(roomId: string, userId: string): UserInterface[] {
// 		this.roomRepository.removeUserFromRoom(roomId, userId);
// 		return this.roomRepository.getUsersInRoom(roomId);
// 	}

// 	getRoomUsers(roomId: string): UserInterface[] {
// 		const room = this.roomRepository.getRoom(roomId);
// 		return room ? room.users : [];
// 	}
// }

// // In-memory repository for simplicity (replace with DB if needed)
// export class InMemoryRoomRepository implements RoomRepository {
// 	private rooms: Map<string, Room> = new Map();

// 	getRoom(roomId: string): Room | undefined {
// 		return this.rooms.get(roomId);
// 	}

// 	createRoom(roomId: string): Room {
// 		const room = new RoomEntity(roomId);
// 		this.rooms.set(roomId, room);
// 		return room;
// 	}

// 	addUserToRoom(roomId: string, user: UserInterface): void {
// 		const room = this.rooms.get(roomId);
// 		if (room) {
// 			room.addUser(user);
// 		}
// 	}

// 	removeUserFromRoom(roomId: string, userId: string): void {
// 		const room = this.rooms.get(roomId);
// 		if (room) {
// 			room.removeUser(userId);
// 			if (room.users.length === 0) {
// 				this.rooms.delete(roomId);
// 			}
// 		}
// 	}

// 	getUsersInRoom(roomId: string): UserInterface[] {
// 		const room = this.rooms.get(roomId);
// 		return room ? room.users : [];
// 	}
// }

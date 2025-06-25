import { useState, useEffect, useRef } from "react";
import { Search, Plus, MessageCircle, ArrowLeft, MoreVertical, Paperclip, Phone, Send, Smile, Video, CheckCheck, Trash2, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { formatTime } from "@/utility/time-data-formatter";
import { useDebounce } from "@/hooks/useDebounce";
import { IMentorDTO } from "@/interfaces/IMentorDTO";
import { fetchAllApprovedMentors } from "@/api/mentors.api.service";
import axiosInstance from "@/api/config/api.config";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert } from "@/components/custom/alert";

// Define interfaces
export interface User {
	id: string;
	name: string;
	avatar: string;
	status: "online" | "offline";
	lastSeen?: string;
	firstName?: string;
	lastName?: string;
}

export interface ISendMessage {
	id: string;
	chatId?: string;
	senderId: string;
	receiverId: string;
	content: string;
	type: "text" | "image" | "file" | "video";
	fileUrl?: string;
}

export interface IReceiveMessage {
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
	readBy: string[];
	createdAt: Date;
	updatedAt: Date;
}

export interface Chat {
	id: string;
	participants: User[];
	lastMessage?: IReceiveMessage;
	unreadCount: number;
	isGroupChat?: boolean;
	groupName?: string;
}

export function MessagePage() {
	const [selectedChatId, setSelectedChatId] = useState<string>();
	const [tempChat, setTempChat] = useState<Chat | null>(null);
	const [allMessages, setAllMessages] = useState<IReceiveMessage[]>([]);
	const [chats, setChats] = useState<Chat[]>([]);
	const [isMobile, setIsMobile] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [loading, setLoading] = useState(false);
	const [statusSyncLoading, setStatusSyncLoading] = useState(true);
	const { socket } = useSocket();
	const user = useSelector((state: RootState) => state.userAuth.user);

	// Check for mobile view
	useEffect(() => {
		const checkIsMobile = () => {
			setIsMobile(window.innerWidth < 768);
		};
		checkIsMobile();
		window.addEventListener("resize", checkIsMobile);
		return () => window.removeEventListener("resize", checkIsMobile);
	}, []);

	// Fetch chats and unread counts from API
	useEffect(() => {
		if (!user?.id || !socket) return;
		const fetchChats = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get(`/user/messages/chats/${user.id}`);
				if (response.data.success) {
					const fetchedChats = response.data.chats;
					setChats(fetchedChats);
					// Fetch unread counts for all chats
					const chatIds = fetchedChats.map((chat: Chat) => chat.id);
					socket.emit("get-unread-counts", { userId: user.id, chatIds });
				}
			} catch (error) {
				console.error("Failed to fetch chats:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchChats();
	}, [user?.id, socket]);

	// Handle socket unread counts response
	useEffect(() => {
		if (!socket) return;

		socket.on("unread-counts-response", (counts: { [chatId: string]: number }) => {
			setChats((prev) =>
				prev.map((chat) => ({
					...chat,
					unreadCount: counts[chat.id] || 0,
				}))
			);
		});

		socket.on("unread-counts-error", (error: { message: string }) => {
			console.error("Unread counts error:", error.message);
			toast.error(error.message);
		});

		return () => {
			socket.off("unread-counts-response");
			socket.off("unread-counts-error");
		};
	}, [socket]);

	// Fetch messages for the selected chat
	useEffect(() => {
		if (!selectedChatId || !user?.id) return;
		const fetchMessages = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get(`/user/messages/messages/${selectedChatId}`, {
					params: {
						page: 1,
						limit: 100,
					},
				});
				setAllMessages(response.data.messages);
			} catch (error) {
				console.error("Failed to fetch messages:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchMessages();
	}, [selectedChatId, user?.id]);

	// Handle socket messages
	useEffect(() => {
		if (!socket || !user?.id) {
			console.log(`Socket or user.id is null`);
			return;
		}
		socket.on("receive-message", (socketMessage: IReceiveMessage) => {
			if (socketMessage.chatId === selectedChatId) {
				setAllMessages((prev) => [...prev, socketMessage]);
			}
			setChats((prev) =>
				prev.map((chat) =>
					chat.id === socketMessage.chatId
						? {
								...chat,
								lastMessage: socketMessage,
								unreadCount: chat.id === selectedChatId ? 0 : chat.unreadCount + 1, // Increment unread count if not in the selected chat
						  }
						: chat
				)
			);
			if (socketMessage.chatId === selectedChatId && !socketMessage.readBy.includes(user.id as string)) {
				socket.emit("mark-as-read", { chatId: socketMessage.chatId, userId: user.id });
				socket.emit("mark-chat-as-read", { chatId: socketMessage.chatId, userId: user.id });
			}
		});

		// Handle message deletion
		socket.on("message-deleted", ({ messageId }: { messageId: string }) => {
			setAllMessages((prev) => prev.filter((msg) => msg.id !== messageId));
			setChats((prev) => prev.map((chat) => (chat.lastMessage?.id === messageId ? { ...chat, lastMessage: undefined } : chat)));
			toast.success("Message deleted successfully");
		});

		return () => {
			socket.off("receive-message");
			socket.off("message-deleted");
		};
	}, [socket, selectedChatId, user?.id]);

	// Handle user status updates
	useEffect(() => {
		if (!socket) return;

		const handleUserStatusUpdate = ({ userId, status }: { userId: string; status: "online" | "offline" }) => {
			setChats((prevChats) =>
				prevChats.map((chat) => {
					if (chat.isGroupChat) return chat;
					const participant = chat.participants.find((p) => p.id === userId);
					if (participant) {
						return {
							...chat,
							participants: chat.participants.map((p) => (p.id === userId ? { ...p, status } : p)),
						};
					}
					return chat;
				})
			);

			setTempChat((prevTempChat) =>
				prevTempChat && prevTempChat.participants.some((p) => p.id === userId)
					? {
							...prevTempChat,
							participants: prevTempChat.participants.map((p) => (p.id === userId ? { ...p, status } : p)),
					  }
					: prevTempChat
			);
		};

		socket.on("user-status-update", handleUserStatusUpdate);

		// Handle initial online users and set status sync loading
		socket.on("online-users", (onlineUsers: { userId: string; status: "online" | "offline" }[]) => {
			onlineUsers.forEach(({ userId, status }) => handleUserStatusUpdate({ userId, status }));
			setStatusSyncLoading(false);
		});

		// Ensure initial sync if socket is already connected
		if (socket) {
			socket.emit("get-online-users");
		}

		return () => {
			socket.off("user-status-update", handleUserStatusUpdate);
			socket.off("online-users");
		};
	}, [socket]);

	const selectedChat = tempChat || (selectedChatId ? chats.find((chat) => chat.id === selectedChatId) : undefined);

	const handleChatSelect = (chatId: string) => {
		setTempChat(null);
		setSelectedChatId(chatId);
		if (isMobile) {
			setShowChat(true);
		}
		if (socket) {
			socket.emit("join-chat-room", { chatId });
			socket.emit("mark-chat-as-read", { chatId, userId: user?.id });
			// Update unread count to 0 for the selected chat
			setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)));
		}
	};

	const handleMentorSelect = (mentor: IMentorDTO) => {
		const tempChat: Chat = {
			id: "",
			participants: [
				{
					id: mentor.id,
					name: `${mentor.firstName} ${mentor.lastName}`,
					avatar: mentor.avatar || "/placeholder.svg",
					status: "offline",
				},
			],
			unreadCount: 0,
			isGroupChat: false,
		};
		setTempChat(tempChat);
		setSelectedChatId(undefined);
		if (isMobile) {
			setShowChat(true);
		}
	};

	const handleBack = () => {
		if (isMobile) {
			setShowChat(false);
			setTempChat(null);
			setSelectedChatId(undefined);
		}
	};

	const handleSendMessage = async (content: string) => {
		if (!selectedChat || !socket || !user?.id) return;

		const chatId = selectedChatId;

		const message: ISendMessage = {
			id: "",
			chatId: chatId,
			senderId: user.id,
			receiverId: selectedChat.isGroupChat ? "" : selectedChat.participants[0].id,
			content,
			type: "text",
		};

		try {
			socket.emit("send-message", message);
		} catch (error) {
			console.error("Failed to send message via socket:", error);
		}
	};

	const handleDeleteMessage = (messageId: string, chatId: string) => {
		if (!socket || !user?.id) return;
		socket.emit("delete-message", {
			messageId,
			chatId,
			senderId: user.id,
		});
	};

	return (
		<div className="flex bg-gray-100 w-full h-[calc(100vh-4rem)] px-10 md:px-20 xl:px-25">
			{isMobile ? (
				<>
					{!showChat ? (
						<div className="w-full h-full">
							<ChatSidebar chats={chats} selectedChatId={selectedChatId} onChatSelect={handleChatSelect} onMentorSelect={handleMentorSelect} loading={loading || statusSyncLoading} />
						</div>
					) : (
						<div className="w-full h-full">
							<ChatWindow
								user={user}
								selectedChat={selectedChat}
								messages={allMessages}
								onBack={handleBack}
								onSendMessage={handleSendMessage}
								onDeleteMessage={handleDeleteMessage}
								isMobile={isMobile}
								loading={loading}
								socket={socket}
								setAllMessages={setAllMessages}
							/>
						</div>
					)}
				</>
			) : (
				<>
					<div className="w-1/3 min-w-[320px] max-w-[400px] h-full">
						<ChatSidebar chats={chats} selectedChatId={selectedChatId} onChatSelect={handleChatSelect} onMentorSelect={handleMentorSelect} loading={loading || statusSyncLoading} />
					</div>
					<div className="flex-1 h-full">
						<ChatWindow
							user={user}
							selectedChat={selectedChat}
							messages={allMessages}
							onBack={handleBack}
							onSendMessage={handleSendMessage}
							onDeleteMessage={handleDeleteMessage}
							isMobile={isMobile}
							loading={loading}
							socket={socket}
							setAllMessages={setAllMessages}
						/>
					</div>
				</>
			)}
		</div>
	);
}

interface ChatSidebarProps {
	chats: Chat[];
	selectedChatId?: string;
	onChatSelect: (chatId: string) => void;
	onMentorSelect: (mentor: IMentorDTO) => void;
	loading: boolean;
}

export function ChatSidebar({ chats, selectedChatId, onChatSelect, onMentorSelect, loading }: ChatSidebarProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [mentors, setMentors] = useState<IMentorDTO[]>([]);
	const [mentorLoading, setMentorLoading] = useState(false);
	const debouncedSearchQuery = useDebounce(searchQuery, 1000);

	// Fetch mentors when debounced search query changes
	useEffect(() => {
		if (!debouncedSearchQuery) {
			setMentors([]);
			return;
		}
		const fetchMentors = async () => {
			setMentorLoading(true);
			try {
				const response = await fetchAllApprovedMentors();
				if (response.success) {
					const approvedMentors = response.mentors;
					const filteredMentors = approvedMentors.filter((mentor: IMentorDTO) => mentor.firstName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || mentor.lastName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
					setMentors(filteredMentors);
				}
			} catch (error) {
				console.error("Failed to fetch mentors:", error);
			} finally {
				setMentorLoading(false);
			}
		};
		fetchMentors();
	}, [debouncedSearchQuery]);

	return (
		<div className="flex flex-col h-full bg-white border-r border-gray-200">
			<div className="p-4 border-b border-gray-200">
				<div className="flex items-center justify-between mb-4">
					<h1 className="text-xl font-semibold text-gray-900">Messages</h1>
					<Button size="sm" className="bg-green-600 hover:bg-green-700">
						<Plus className="h-4 w-4" />
					</Button>
				</div>
				<div className="relative">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
					<Input placeholder="Search conversations or mentors..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-gray-50 border-gray-200" />
				</div>
			</div>
			<div className="flex-1 overflow-y-auto">
				{loading || mentorLoading ? (
					<div className="flex justify-center items-center h-full">
						<p className="text-gray-500">Loading...</p>
					</div>
				) : searchQuery && mentors.length > 0 ? (
					<>
						<div className="px-4 py-2 text-sm font-semibold text-gray-700">Mentors</div>
						{mentors.map((mentor) => (
							<div key={mentor.id} onClick={() => onMentorSelect(mentor)} className="flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors">
								<div className="relative">
									<Avatar className="h-9 w-9">
										<AvatarImage src={mentor.avatar || "/placeholder.svg"} alt={mentor.firstName} />
										<AvatarFallback>
											{mentor.firstName
												?.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
								</div>
								<div className="ml-3 flex-1 min-w-0">
									<p className="text-sm font-medium text-gray-900 truncate">
										{mentor.firstName} {mentor.lastName}
									</p>
								</div>
							</div>
						))}
					</>
				) : chats.length === 0 && mentors.length === 0 ? (
					<div className="flex flex-col items-center justify-center h-full text-gray-500">
						<MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
						<p className="text-sm">No conversations or mentors found</p>
					</div>
				) : (
					chats.map((chat) => {
						const displayName = chat.isGroupChat ? chat.groupName || "Group Chat" : `${chat.participants[0]?.firstName} ${chat.participants[0]?.lastName}`;
						const displayAvatar = chat.isGroupChat ? "/group-placeholder.svg" : chat.participants[0]?.avatar || "/placeholder.svg";
						const isSelected = selectedChatId === chat.id;

						return (
							<div key={chat.id} onClick={() => onChatSelect(chat.id)} className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? "bg-green-50 border-r-2 border-green-600" : ""}`}>
								<div className="relative">
									<Avatar className="h-9 w-9">
										<AvatarImage src={displayAvatar} alt={displayName} />
										<AvatarFallback>
											{displayName
												?.split(" ")
												.map((n) => n[0])
												.join("")
												.toUpperCase()}
										</AvatarFallback>
									</Avatar>
									{!chat.isGroupChat && chat.participants[0]?.status === "online" && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>}
								</div>
								<div className="ml-3 flex-1 min-w-0">
									<div className="flex items-center justify-between">
										<p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
										{chat.lastMessage && <p className="text-xs text-gray-500">{formatTime(chat.lastMessage.createdAt)}</p>}
									</div>
									<div className="flex items-center justify-between">
										<p className="text-sm text-gray-500 truncate">{chat.lastMessage?.content || "No messages yet"}</p>
										{chat.unreadCount > 0 && <Badge className="bg-green-600 hover:bg-green-700 text-xs px-2 py-1 min-w-[20px] h-5 flex items-center justify-center">{chat.unreadCount}</Badge>}
									</div>
								</div>
							</div>
						);
					})
				)}
			</div>
		</div>
	);
}

interface ChatWindowProps {
	user: RootState["userAuth"]["user"];
	selectedChat?: Chat;
	messages: IReceiveMessage[];
	onBack: () => void;
	onSendMessage: (content: string) => void;
	onDeleteMessage: (messageId: string, chatId: string) => void;
	isMobile?: boolean;
	loading: boolean;
	socket: any; // Replace with Socket type from 'socket.io-client' if available
	setAllMessages: React.Dispatch<React.SetStateAction<IReceiveMessage[]>>;
}

export function ChatWindow({ user, selectedChat, messages, onBack, onSendMessage, onDeleteMessage, isMobile, loading, socket, setAllMessages }: ChatWindowProps) {
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	// Handle messages read update
	useEffect(() => {
		if (!socket) return;

		const handleMessagesReadUpdate = ({ chatId, readerId, messageIds }: { chatId: string; readerId: string; messageIds: string[] }) => {
			console.log(`Received messages-read-update: chatId=${chatId}, readerId=${readerId}, messageIds=`, messageIds);

			if (chatId === selectedChat?.id) {
				setAllMessages((prevMessages: IReceiveMessage[]) => {
					const updatedMessages = prevMessages.map((msg: IReceiveMessage) => (messageIds.includes(msg.id) && !msg.readBy.includes(readerId) ? { ...msg, readBy: [...msg.readBy, readerId] } : msg));
					console.log("Updated messages:", updatedMessages);
					return updatedMessages;
				});
			}
		};

		socket.on("messages-read-update", handleMessagesReadUpdate);

		return () => {
			socket.off("messages-read-update", handleMessagesReadUpdate);
		};
	}, [socket, selectedChat?.id, setAllMessages]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const handleSendMessage = () => {
		if (newMessage.trim()) {
			onSendMessage(newMessage.trim());
			setNewMessage("");
		}
	};

	const handleKeyPress = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSendMessage();
		}
	};

	if (!selectedChat) {
		return (
			<div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
				<div className="text-center">
					<div className="w-32 h-32 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
						<svg className="w-16 h-16 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
							<path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
						</svg>
					</div>
					<h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
					<p className="text-gray-500">Choose from your existing conversations or start a new one</p>
				</div>
			</div>
		);
	}

	const userMessages = messages.filter((msg) => msg.chatId === selectedChat.id);

	console.log("userMessages: ", userMessages[userMessages.length - 1]);

	return (
		<div className="flex flex-col h-full bg-white">
			<div className="flex items-center p-4 border-b border-gray-200 bg-white shrink-0">
				{isMobile && (
					<Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-1">
						<ArrowLeft className="h-5 w-5" />
					</Button>
				)}
				<div className="relative">
					<Avatar className="h-10 w-10">
						<AvatarImage src={selectedChat.isGroupChat ? "/group-placeholder.svg" : selectedChat.participants[0]?.avatar || "/placeholder.svg"} alt={selectedChat.groupName || selectedChat.participants[0]?.name} />
						<AvatarFallback>
							{(selectedChat.isGroupChat ? selectedChat.groupName : selectedChat.participants[0]?.firstName)
								?.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					{!selectedChat.isGroupChat && selectedChat.participants[0]?.status === "online" && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>}
				</div>
				<div className="ml-3 flex-1">
					<h2 className="text-sm font-medium text-gray-900">{selectedChat.isGroupChat ? selectedChat.groupName : `${selectedChat.participants[0]?.firstName} ${selectedChat.participants[0]?.lastName || ""}`}</h2>
					<p className="text-xs text-gray-500">{selectedChat.isGroupChat ? `${selectedChat.participants.length} members` : selectedChat.participants[0]?.status === "online" ? "Online" : "Offline"}</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm">
						<Phone className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="sm">
						<Video className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="sm">
						<MoreVertical className="h-5 w-5" />
					</Button>
				</div>
			</div>
			<div className="flex-1 overflow-y-auto p-4 bg-gray-50">
				{loading ? (
					<div className="flex justify-center items-center h-full">
						<p className="text-gray-500">Loading messages...</p>
					</div>
				) : userMessages.length === 0 ? (
					<div className="flex items-center justify-center h-full">
						<p className="text-gray-500">No messages yet. Start the conversation!</p>
					</div>
				) : (
					userMessages.map((message) => (
						<MessageBubble key={message.id} chat={selectedChat} message={message} isOwn={message.sender.id === user?.id} isGroupChat={selectedChat.isGroupChat} onDeleteMessage={() => onDeleteMessage(message.id, message.chatId)} />
					))
				)}
				<div ref={messagesEndRef} />
			</div>
			<div className="p-4 border-t border-gray-200 bg-white shrink-0 sticky bottom-0 z-10">
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm">
						<Paperclip className="h-5 w-5" />
					</Button>
					<div className="flex-1 relative">
						<Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} className="pr-10" />
						<Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2">
							<Smile className="h-4 w-4" />
						</Button>
					</div>
					<Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="bg-green-600 hover:bg-green-700">
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

interface MessageBubbleProps {
	chat: Chat;
	message: IReceiveMessage;
	isOwn: boolean;
	isGroupChat?: boolean;
	onDeleteMessage: () => void;
}

export function MessageBubble({ chat, message, isOwn, isGroupChat, onDeleteMessage }: MessageBubbleProps) {
	const [isOpen, setIsOpen] = useState(false);

	// Determine tick status for messages
	const getReadStatus = () => {
		if (!isOwn) return null; // Only show ticks for your own messages

		const readCount = message.readBy.length;
		const expectedReadCount = isGroupChat ? chat.participants.length : 2;

		// ✅ All participants have read the message
		if (readCount === expectedReadCount) {
			return <CheckCheck className="h-4 w-4 text-blue-500" />;
		}

		// ✅ Message has been sent (even if no one else read it yet)
		return <CheckCheck className="h-4 w-4 text-gray-300" />;
	};

	const handleInfoClick = () => {
		toast.info(`Message sent at ${formatTime(message.createdAt)} by ${message.sender.firstName} ${message.sender.lastName}`);
	};

	return (
		<div
			className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}
			onContextMenu={(e) => {
				e.preventDefault();
				setIsOpen(true);
			}}>
			<DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
				<DropdownMenuTrigger asChild>
					<div className="flex flex-col max-w-xs lg:max-w-md">
						{isGroupChat && !isOwn && (
							<div className="flex items-center mb-1">
								<Avatar className="h-6 w-6 mr-2">
									<AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={`${message.sender.firstName} ${message.sender.lastName}`} />
									<AvatarFallback>{`${message.sender.firstName[0]}${message.sender.lastName[0]}`.toUpperCase()}</AvatarFallback>
								</Avatar>
								<p className="text-xs font-medium text-gray-700">{`${message.sender.firstName} ${message.sender.lastName}`}</p>
							</div>
						)}
						<div className={`px-4 py-2 rounded-lg ${isOwn ? "bg-green-600 text-white rounded-br-sm" : "bg-gray-200 text-gray-900 rounded-bl-sm"}`}>
							{message.type === "text" ? (
								<p className="text-sm">{message.content}</p>
							) : message.type === "image" ? (
								<img src={message.fileUrl} alt="Image" className="max-w-full h-auto rounded" />
							) : message.type === "video" ? (
								<video src={message.fileUrl} controls className="max-w-full h-auto rounded" />
							) : (
								<a href={message.fileUrl} className="text-sm underline" download>
									Download File
								</a>
							)}
							<div className={`flex items-center justify-end mt-1 space-x-1 ${isOwn ? "text-green-100" : "text-gray-500"}`}>
								<span className="text-xs">{formatTime(message.createdAt)}</span>
								{getReadStatus()}
							</div>
						</div>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent align={isOwn ? "end" : "start"} className="w-40">
					<DropdownMenuItem onSelect={handleInfoClick}>
						<Info className="mr-2 h-4 w-4" />
						<span>Info</span>
					</DropdownMenuItem>
					{isOwn && (
						<Alert
							triggerElement={
								<div className="w-full">
									<DropdownMenuItem className="hover:bg-red-600 hover:text-white w-full" onSelect={(e) => e.preventDefault()}>
										<Trash2 className="mr-2 h-4 w-4" />
										<span>Delete</span>
									</DropdownMenuItem>
								</div>
							}
							contentTitle="Confirm Delete"
							contentDescription="Are you sure you want to delete this message? This action cannot be undone."
							actionText="Delete"
							onConfirm={onDeleteMessage}
						/>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}

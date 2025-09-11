import { useState, useEffect, useRef } from "react";
import { Search, Plus, MessageCircle, ArrowLeft, MoreVertical, Paperclip, Phone, Send, Smile, Video, CheckCheck, Trash2, Info, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSocket } from "@/context/SocketContext";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useDebounce } from "@/hooks/useDebounce";
import { IMentorDTO } from "@/interfaces/mentor.interface";
import { fetchAllApprovedMentors } from "@/api/mentors.api.service";
import axiosInstance from "@/api/config/api.config";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Alert } from "@/components/custom/alert";
import { formatTime } from "@/utility/time-data-formatter";
import { toast } from "sonner";
import { Socket } from "socket.io-client";

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
	chatId?: string; // optional, can be created server-side if new
	senderId: string;
	receiverId: string;
	content: string;
	type: "text" | "image" | "file" | "video";
	fileUrl?: string; // only if it's not text
}

export interface IReceiveMessage {
	id: string;
	chatId: string;
	sender: {
		id: string;
		fullName: string;
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
	const [selectedChatId, setSelectedChatId] = useState<string | undefined>();
	const [tempChat, setTempChat] = useState<Chat | null>(null);
	const [allMessages, setAllMessages] = useState<IReceiveMessage[]>([]);
	const [chats, setChats] = useState<Chat[]>([]);
	const [isMobile, setIsMobile] = useState(false);
	const [showChat, setShowChat] = useState(false);
	const [loading, setLoading] = useState(false);
	const { socket, isUserOnline } = useSocket();
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

	// Join user-specific room and fetch chats
	useEffect(() => {
		if (!user?.id || !socket) return;

		// Join user-specific room
		socket.emit("join-user", { userId: user.id });

		const fetchChats = async () => {
			setLoading(true);
			try {
				const response = await axiosInstance.get(`/user/messages/chats/${user.id}`);
				if (response.data.success) {
					const fetchedChats = response.data.chats;
					setChats(fetchedChats);
					const chatIds = fetchedChats.map((chat: Chat) => chat.id);
					if (chatIds.length > 0) {
						socket.emit("get-unread-counts", { userId: user.id, chatIds });
					}
				} else {
					toast.error("Failed to load chats");
				}
			} catch (error) {
				console.error("Failed to fetch chats:", error);
				toast.error("Failed to load chats");
			} finally {
				setLoading(false);
			}
		};
		fetchChats();
	}, [user?.id, socket]);

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
				if (response.data.success) {
					setAllMessages(response.data.messages);
				} else {
					toast.error("Failed to load messages");
				}
			} catch (error) {
				console.error("Failed to fetch messages:", error);
				toast.error("Failed to load messages");
			} finally {
				setLoading(false);
			}
		};
		fetchMessages();
	}, [selectedChatId, user?.id]);

	// Handle socket messages and real-time updates
	useEffect(() => {
		if (!socket || !user?.id) return;

		const handleReceiveMessage = (message: IReceiveMessage) => {
			// Validate message
			if (!message?.id || !message.chatId) {
				console.error("Invalid message received:", message);
				return;
			}

			// If message belongs to the selected chat → append to messages
			if (message.chatId === selectedChatId) {
				setAllMessages((prev) => {
					if (prev.some((msg) => msg.id === message.id)) return prev;
					return [...prev, message];
				});
			}

			// Always update lastMessage & unreadCount for the chat, then re-order list
			setChats((prevChats) => {
				let updatedChats = prevChats.map((chat) =>
					chat.id === message.chatId
						? {
								...chat,
								lastMessage: message,
								unreadCount: message.chatId === selectedChatId || message.sender.id === user.id ? 0 : chat.unreadCount + 1,
						  }
						: chat
				);

				// Move chat with new message to the top
				const chatWithMessage = updatedChats.find((c) => c.id === message.chatId);
				if (chatWithMessage) {
					updatedChats = [chatWithMessage, ...updatedChats.filter((c) => c.id !== message.chatId)];
				}

				return updatedChats;
			});
		};

		const handleMessagesRead = ({ chatId, userId: readerId }: { chatId: string; userId: string }) => {
			if (!chatId || !readerId) {
				console.error("Invalid messages-read payload:", { chatId, readerId });
				return;
			}
			if (chatId === selectedChatId) {
				setAllMessages((prevMessages) =>
					prevMessages.map((msg) => {
						if (msg.chatId === chatId && !msg.readBy.includes(readerId) && msg.sender.id !== readerId) {
							return { ...msg, readBy: [...msg.readBy, readerId] };
						}
						return msg;
					})
				);
			}
			// Reset unread count for the chat
			setChats((prevChats) => prevChats.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)));
		};

		const handleMessageDeleted = ({ messageId, chatId }: { messageId: string; chatId: string }) => {
			if (!messageId || !chatId) {
				console.error("Invalid message-deleted payload:", { messageId, chatId });
				return;
			}
			setAllMessages((prevMessages) => prevMessages.filter((msg) => msg.id !== messageId));
			// Re-fetch unread counts for the affected chat
			if (chatId && user.id) {
				socket.emit("get-unread-counts", { userId: user.id, chatIds: [chatId] });
			}
		};

		const handleUnreadCounts = (countsMap: { [chatId: string]: number }) => {
			console.log("📬 Got unread map:", countsMap);
			setChats((prevChats) =>
				prevChats.map((chat) => ({
					...chat,
					unreadCount: countsMap[chat.id] !== undefined ? Math.max(0, countsMap[chat.id]) : chat.unreadCount,
				}))
			);
		};

		const handleUnreadCountsError = ({ message }: { message: string }) => {
			toast.error(message || "Failed to fetch unread counts");
		};

		const handleSocketConnect = () => {
			console.log("Socket reconnected, re-fetching unread counts");
			socket.emit("join-user", { userId: user.id });
			if (chats.length > 0) {
				const chatIds = chats.map((chat) => chat.id);
				socket.emit("get-unread-counts", { userId: user.id, chatIds });
			}
		};

		const handleNewChat = (chat: Chat) => {
			console.log("New chat:", chat);
			// setChats((prevChats) => [chat, ...prevChats])
			setChats((prevChats) => {
				// Check if chat already exists
				if (prevChats.some((c) => c.id === chat.id)) return prevChats;

				// Add unreadCount if missing
				const newChat = { ...chat, unreadCount: chat.unreadCount || 0 };
				return [newChat, ...prevChats];
			});
		};

		socket.on("receive-message", handleReceiveMessage);
		socket.on("messages-read", handleMessagesRead);
		socket.on("message-deleted", handleMessageDeleted);
		socket.on("new-chat", handleNewChat);
		socket.on("unread-counts-response", handleUnreadCounts);
		socket.on("unread-counts-error", handleUnreadCountsError);
		socket.on("error", ({ message }) => {
			toast.error(message || "Something went wrong");
		});
		socket.on("connect", handleSocketConnect);

		return () => {
			socket.off("receive-message", handleReceiveMessage);
			socket.off("messages-read", handleMessagesRead);
			socket.off("message-deleted", handleMessageDeleted);
			socket.off("new-chat", handleNewChat);
			socket.off("unread-counts-response", handleUnreadCounts);
			socket.off("unread-counts-error", handleUnreadCountsError);
			socket.off("error");
			socket.off("connect", handleSocketConnect);
		};
	}, [socket, selectedChatId, user?.id, chats]);

	const selectedChat = tempChat || (selectedChatId ? chats.find((chat) => chat.id === selectedChatId) : undefined);

	const handleChatSelect = (chatId: string) => {
		if (!chatId) return;
		if (socket && selectedChatId) {
			socket.emit("leave-chat", selectedChatId);
		}

		setTempChat(null);
		setSelectedChatId(chatId);
		if (isMobile) {
			setShowChat(true);
		}
		if (socket && user?.id) {
			socket.emit("join-chat", { chatId, userId: user.id });
			socket.emit("mark-chat-as-read", { chatId, userId: user.id });
			setChats((prev) => prev.map((chat) => (chat.id === chatId ? { ...chat, unreadCount: 0 } : chat)));
		}
	};

	const getChatPartner = (currentUserId: string, participants: User[]) => {
		return participants.find((user) => user.id !== currentUserId) || null;
	};

	const handleMentorSelect = (mentor: IMentorDTO) => {
		if (!mentor?.userId) return;
		const tempChat: Chat = {
			id: "",
			participants: [
				{
					id: mentor.userId,
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
			if (socket && selectedChatId) {
				socket.emit("leave-chat", selectedChatId);
			}
			setShowChat(false);
			setTempChat(null);
			setSelectedChatId(undefined);
		}
	};

	const handleSendMessage = async (content: string) => {
		if (!selectedChat || !socket || !user?.id || !content.trim()) return;

		const { id: chatId, isGroupChat, participants } = selectedChat;
		const receiverId = isGroupChat ? "" : getChatPartner(user.id, participants)?.id ?? "";

		if (!isGroupChat && !receiverId) {
			console.warn("No receiver found for 1-to-1 chat");
			toast.error("Cannot send message: No recipient found");
			return;
		}

		// Create temporary message object for UI
		const message: ISendMessage = {
			id: Math.random().toString(36).substring(2, 9), // Temporary ID
			chatId,
			senderId: user.id,
			receiverId,
			content: content.trim(),
			type: "text",
		};

		const tempMessage: IReceiveMessage = {
			...message,
			chatId: message.chatId || "",
			sender: { id: user.id, fullName: user.fullName || "", avatar: user.avatar || "" }, // add sender details
			readBy: [user.id], // you already "read" your own message
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		// Optimistically update the chat list
		setChats((prevChats) => {
			let updatedChats = prevChats.map((chat) =>
				chat.id === chatId
					? { ...chat, lastMessage: tempMessage, unreadCount: 0 } // reset unreadCount since it's your message
					: chat
			);

			// Move this chat to the top
			const chatWithMessage = updatedChats.find((c) => c.id === chatId);
			if (chatWithMessage) {
				updatedChats = [chatWithMessage, ...updatedChats.filter((c) => c.id !== chatId)];
			}

			return updatedChats;
		});

		// Send message via socket
		try {
			socket.emit("send-message", message);
		} catch (error) {
			console.error("Socket emit failed:", error);
			toast.error("Failed to send message");
		}
	};

	const handleDeleteMessage = (messageId: string, chatId: string) => {
		if (!socket || !user?.id || !messageId || !chatId) return;
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
							<ChatSidebar userId={user?.id!} chats={chats} selectedChatId={selectedChatId} isUserOnline={isUserOnline} onChatSelect={handleChatSelect} onMentorSelect={handleMentorSelect} loading={loading} />
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
								getChatPartner={getChatPartner}
								loading={loading}
								socket={socket}
								isUserOnline={isUserOnline}
							/>
						</div>
					)}
				</>
			) : (
				<>
					<div className="w-1/3 min-w-[320px] max-w-[400px] h-full">
						<ChatSidebar isUserOnline={isUserOnline} userId={user?.id!} chats={chats} selectedChatId={selectedChatId} onChatSelect={handleChatSelect} onMentorSelect={handleMentorSelect} loading={loading} />
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
							getChatPartner={getChatPartner}
							loading={loading}
							socket={socket}
							isUserOnline={isUserOnline}
						/>
					</div>
				</>
			)}
		</div>
	);
}

interface ChatSidebarProps {
	userId: string;
	chats: Chat[];
	selectedChatId?: string;
	onChatSelect: (chatId: string) => void;
	onMentorSelect: (mentor: IMentorDTO) => void;
	isUserOnline: (userId: string) => boolean;
	loading: boolean;
}

export function ChatSidebar({ userId, chats, selectedChatId, onChatSelect, isUserOnline, onMentorSelect, loading }: ChatSidebarProps) {
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
				const response = await fetchAllApprovedMentors(userId);
				if (response.success) {
					const approvedMentors = response.mentors;
					const filteredMentors = approvedMentors.filter((mentor: IMentorDTO) => mentor.firstName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) || mentor.lastName.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
					setMentors(filteredMentors);
				} else {
					toast.error("Failed to load mentors");
				}
			} catch (error) {
				console.error("Failed to fetch mentors:", error);
				toast.error("Failed to load mentors");
			} finally {
				setMentorLoading(false);
			}
		};
		fetchMentors();
	}, [debouncedSearchQuery, userId]);

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
						const otherParticipant = chat.isGroupChat ? null : chat.participants.find((participant) => participant.id !== userId);
						const displayName = chat.isGroupChat ? chat.groupName || "Group Chat" : otherParticipant ? `${otherParticipant.firstName} ${otherParticipant.lastName || ""}` : "Unknown User";
						const displayAvatar = chat.isGroupChat ? "/group-placeholder.svg" : otherParticipant?.avatar || "/placeholder.svg";
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
									{!chat.isGroupChat && isUserOnline(otherParticipant?.id || "") && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>}
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
	getChatPartner: (currentUserId: string, participants: User[]) => User | null;
	socket: Socket | null; // Updated to allow null
	isUserOnline: (userId: string) => boolean;
}

export function ChatWindow({ user, selectedChat, messages, onBack, onSendMessage, getChatPartner, onDeleteMessage, isUserOnline, isMobile, loading, socket }: ChatWindowProps) {
	const [newMessage, setNewMessage] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const messageRefs = useRef<Map<string, HTMLDivElement>>(new Map());

	const scrollToBottom = () => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	// Set ref for each message
	const setMessageRef = (messageId: string, element: HTMLDivElement | null) => {
		if (element) {
			messageRefs.current.set(messageId, element);
		} else {
			messageRefs.current.delete(messageId);
		}
	};

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
	const chatPartner = getChatPartner(user!.id!, selectedChat.participants);
	if (!chatPartner && !selectedChat.isGroupChat) return null; // Handle null chatPartner for non-group chats

	const isPartnerOnline = selectedChat.isGroupChat ? false : isUserOnline(chatPartner?.id || "");

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
						<AvatarImage src={selectedChat.isGroupChat ? "/group-placeholder.svg" : chatPartner?.avatar || "/placeholder.svg"} alt={selectedChat.groupName || chatPartner?.name || "Chat"} />
						<AvatarFallback>
							{(selectedChat.isGroupChat ? selectedChat.groupName : chatPartner?.firstName || "Chat")
								?.split(" ")
								.map((n) => n[0])
								.join("")
								.toUpperCase()}
						</AvatarFallback>
					</Avatar>
					{!selectedChat.isGroupChat && isPartnerOnline && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>}
				</div>
				<div className="ml-3 flex-1">
					<h2 className="text-sm font-medium text-gray-900">{selectedChat.isGroupChat ? selectedChat.groupName : `${chatPartner?.firstName || ""} ${chatPartner?.lastName || ""}`}</h2>
					<p className="text-xs text-gray-500">{selectedChat.isGroupChat ? `${selectedChat.participants.length} members` : isPartnerOnline ? "Online" : "Offline"}</p>
				</div>
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm" disabled={!socket}>
						<Phone className="h-5 w-5" />
					</Button>
					<Button variant="ghost" size="sm" disabled={!socket}>
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
						<MessageBubble
							key={message.id}
							userId={user?.id!}
							chatIsActive={selectedChat.id === message.chatId}
							message={message}
							socket={socket}
							isOwn={message.sender.id === user?.id}
							isGroupChat={selectedChat.isGroupChat}
							onDeleteMessage={() => onDeleteMessage(message.id, message.chatId)}
							setMessageRef={(element) => setMessageRef(message.id, element)}
						/>
					))
				)}
				<div ref={messagesEndRef} />
			</div>
			<div className="p-4 border-t border-gray-200 bg-white shrink-0 sticky bottom-0 z-10">
				<div className="flex items-center space-x-2">
					<Button variant="ghost" size="sm" disabled={!socket}>
						<Paperclip className="h-5 w-5" />
					</Button>
					<div className="flex-1 relative">
						<Input placeholder="Type a message..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyPress={handleKeyPress} className="pr-10" disabled={!socket} />
						<Button variant="ghost" size="sm" className="absolute right-1 top-1/2 transform -translate-y-1/2" disabled={!socket}>
							<Smile className="h-4 w-4" />
						</Button>
					</div>
					<Button onClick={handleSendMessage} disabled={!newMessage.trim() || !socket} className="bg-green-600 hover:bg-green-700">
						<Send className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}

interface MessageBubbleProps {
	userId: string;
	chatIsActive: boolean;
	message: IReceiveMessage;
	isOwn: boolean;
	isGroupChat?: boolean;
	socket: Socket | null; // Updated to allow null
	onDeleteMessage: () => void;
	setMessageRef: (element: HTMLDivElement | null) => void;
}

export function MessageBubble({ userId, chatIsActive, socket, message, isOwn, isGroupChat, onDeleteMessage, setMessageRef }: MessageBubbleProps) {
	const [isOpen, setIsOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	// Determine tick status for messages
	const getReadStatus = () => {
		if (!isOwn) return null; // Only show ticks for sender's own messages
		const isReadByOthers = message.readBy.some((id) => id !== userId);
		return <CheckCheck className={`h-4 w-4 ${isReadByOthers ? "text-blue-700" : "text-gray-300"}`} />;
	};

	// Mark messages as read for non-sender messages
	useEffect(() => {
		if (!ref.current || !socket || !chatIsActive || document.visibilityState !== "visible" || isOwn || message.readBy.includes(userId)) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting) {
					socket.emit("mark-message-as-read", {
						messageId: message.id,
						chatId: message.chatId,
						userId,
					});
				}
			},
			{ threshold: 1.0 }
		);

		observer.observe(ref.current);

		return () => {
			if (ref.current) observer.unobserve(ref.current);
		};
	}, [message, userId, socket, chatIsActive, isOwn]);

	// Handle tab visibility change
	useEffect(() => {
		if (!socket) return;

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible" && ref.current && chatIsActive && !isOwn && !message.readBy.includes(userId)) {
				const observer = new IntersectionObserver(
					(entries) => {
						const [entry] = entries;
						if (entry.isIntersecting) {
							socket.emit("mark-message-as-read", {
								messageId: message.id,
								chatId: message.chatId,
								userId,
							});
						}
					},
					{ threshold: 1.0 }
				);
				observer.observe(ref.current);
				return () => {
					if (ref.current) observer.unobserve(ref.current);
				};
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);
		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, [message, userId, socket, chatIsActive, isOwn]);

	// Set message ref for parent component
	useEffect(() => {
		setMessageRef(ref.current);
	}, [setMessageRef]);

	const handleInfoClick = () => {
		toast.info(`Message sent at ${formatTime(message.createdAt)} by ${message.sender.fullName}`);
	};

	return (
		<div
			ref={ref}
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
									<AvatarImage src={message.sender.avatar || "/placeholder.svg"} alt={message.sender.fullName} />
									<AvatarFallback>
										{message.sender.fullName
											?.split(" ")
											.map((n) => n[0])
											.join("")
											.toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<p className="text-xs font-medium text-gray-700">{message.sender.fullName}</p>
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

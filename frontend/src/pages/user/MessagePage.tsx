import { useState, useEffect, useRef } from "react";
import { Search, Plus, MessageCircle, ArrowLeft, MoreVertical, Paperclip, Phone, Send, Smile, Video, Check, CheckCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: "online" | "offline";
  lastSeen?: string;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  type: "text" | "image" | "file";
  status: "sent" | "delivered" | "read";
}

export interface Chat {
  id: string;
  participants: User[];
  lastMessage?: Message;
  unreadCount: number;
}

export function MessagePage() {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const [allMessages, setAllMessages] = useState<Message[]>(messages);
  const [isMobile, setIsMobile] = useState(false);
  const [showChat, setShowChat] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener("resize", checkIsMobile);

    return () => window.removeEventListener("resize", checkIsMobile);
  }, []);

  const selectedUser = selectedChatId ? chats.find((chat) => chat.id === selectedChatId)?.participants[0] : undefined;

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    if (isMobile) {
      setShowChat(true);
    }
  };

  const handleBack = () => {
    if (isMobile) {
      setShowChat(false);
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedUser) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      senderId: "me",
      receiverId: selectedUser.id,
      content,
      timestamp: new Date(),
      type: "text",
      status: "sent",
    };

    setAllMessages((prev) => [...prev, newMessage]);
  };

  const handleNewChat = () => {
    console.log("New chat clicked");
  };

  return (
    <div className="flex bg-gray-100 w-full px-10 md:px-20 xl:px-25 h-[calc(100vh-4rem)]">
      {/* Mobile: Show sidebar or chat based on state */}
      {isMobile ? (
        <>
          {!showChat ? (
            <div className="w-full h-full">
              <ChatSidebar chats={chats} selectedChatId={selectedChatId} onChatSelect={handleChatSelect} onNewChat={handleNewChat} />
            </div>
          ) : (
            <div className="w-full h-full">
              <ChatWindow selectedUser={selectedUser} messages={allMessages} onBack={handleBack} onSendMessage={handleSendMessage} isMobile={isMobile} />
            </div>
          )}
        </>
      ) : (
        /* Desktop: Show both panels */
        <>
          <div className="w-1/3 min-w-[320px] max-w-[400px] h-full">
            <ChatSidebar chats={chats} selectedChatId={selectedChatId} onChatSelect={handleChatSelect} onNewChat={handleNewChat} />
          </div>
          <div className="flex-1 h-full">
            <ChatWindow selectedUser={selectedUser} messages={allMessages} onBack={handleBack} onSendMessage={handleSendMessage} isMobile={isMobile} />
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
  onNewChat: () => void;
}

export function ChatSidebar({ chats, selectedChatId, onChatSelect, onNewChat }: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) => chat.participants[0]?.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });
    } else if (days === 1) {
      return "Yesterday";
    } else if (days < 7) {
      return date.toLocaleDateString("en-US", { weekday: "short" });
    } else {
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-gray-900">Messages</h1>
          <Button onClick={onNewChat} size="sm" className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input placeholder="Search conversations..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-gray-50 border-gray-200" />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
            <p className="text-sm">No conversations found</p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const user = chat.participants[0];
            const isSelected = selectedChatId === chat.id;

            return (
              <div key={chat.id} onClick={() => onChatSelect(chat.id)} className={`flex items-center p-4 hover:bg-gray-50 cursor-pointer transition-colors ${isSelected ? "bg-green-50 border-r-2 border-green-600" : ""}`}>
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user?.avatar || "/placeholder.svg"} alt={user?.name} />
                    <AvatarFallback>
                      {user?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {user?.status === "online" && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>}
                </div>

                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                    {chat.lastMessage && <p className="text-xs text-gray-500">{formatTime(chat.lastMessage.timestamp)}</p>}
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
  selectedUser?: User;
  messages: Message[];
  onBack: () => void;
  onSendMessage: (content: string) => void;
  isMobile?: boolean;
}

export function ChatWindow({ selectedUser, messages, onBack, onSendMessage, isMobile }: ChatWindowProps) {
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

  if (!selectedUser) {
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

  const userMessages = messages.filter((msg) => (msg.senderId === selectedUser.id && msg.receiverId === "me") || (msg.senderId === "me" && msg.receiverId === selectedUser.id));

  return (
    <div className="flex-1 flex flex-col bg-white h-full">
      {/* Header */}
      <div className="flex items-center p-4 border-b border-gray-200 bg-white shrink-0">
        {isMobile && (
          <Button variant="ghost" size="sm" onClick={onBack} className="mr-2 p-1">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        )}

        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={selectedUser.avatar || "/placeholder.svg"} alt={selectedUser.name} />
            <AvatarFallback>
              {selectedUser.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          {selectedUser.status === "online" && <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>}
        </div>

        <div className="ml-3 flex-1">
          <h2 className="text-sm font-medium text-gray-900">{selectedUser.name}</h2>
          <p className="text-xs text-gray-500">{selectedUser.status === "online" ? "Online" : `Last seen ${selectedUser.lastSeen}`}</p>
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {userMessages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          userMessages.map((message) => <MessageBubble key={message.id} message={message} isOwn={message.senderId === "me"} />)
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white shrink-0">
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
  message: Message;
  isOwn: boolean;
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getStatusIcon = () => {
    if (!isOwn) return null;

    switch (message.status) {
      case "sent":
        return <Check className="h-3 w-3 text-gray-400" />;
      case "delivered":
        return <CheckCheck className="h-3 w-3 text-gray-400" />;
      case "read":
        return <CheckCheck className="h-3 w-3 text-blue-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${isOwn ? "bg-green-600 text-white rounded-br-sm" : "bg-gray-200 text-gray-900 rounded-bl-sm"}`}>
        <p className="text-sm">{message.content}</p>
        <div className={`flex items-center justify-end mt-1 space-x-1 ${isOwn ? "text-green-100" : "text-gray-500"}`}>
          <span className="text-xs">{formatTime(message.timestamp)}</span>
          {getStatusIcon()}
        </div>
      </div>
    </div>
  );
}

export const users: User[] = [
  {
    id: "1",
    name: "Alice Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "2",
    name: "Bob Smith",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: "2 hours ago",
  },
  {
    id: "3",
    name: "Carol Davis",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
  {
    id: "4",
    name: "David Wilson",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "offline",
    lastSeen: "1 day ago",
  },
  {
    id: "5",
    name: "Emma Brown",
    avatar: "/placeholder.svg?height=40&width=40",
    status: "online",
  },
];

export const messages: Message[] = [
  {
    id: "1",
    senderId: "1",
    receiverId: "me",
    content: "Hey! How are you doing?",
    timestamp: new Date("2024-01-15T10:30:00"),
    type: "text",
    status: "read",
  },
  {
    id: "2",
    senderId: "me",
    receiverId: "1",
    content: "I'm doing great! Thanks for asking. How about you?",
    timestamp: new Date("2024-01-15T10:32:00"),
    type: "text",
    status: "read",
  },
  {
    id: "3",
    senderId: "1",
    receiverId: "me",
    content: "Pretty good! Working on some exciting projects.",
    timestamp: new Date("2024-01-15T10:35:00"),
    type: "text",
    status: "read",
  },
  {
    id: "4",
    senderId: "me",
    receiverId: "1",
    content: "That sounds awesome! Would love to hear more about it.",
    timestamp: new Date("2024-01-15T10:37:00"),
    type: "text",
    status: "delivered",
  },
  {
    id: "5",
    senderId: "2",
    receiverId: "me",
    content: "Don't forget about our meeting tomorrow!",
    timestamp: new Date("2024-01-15T09:15:00"),
    type: "text",
    status: "read",
  },
  {
    id: "6",
    senderId: "3",
    receiverId: "me",
    content: "Thanks for the help with the project!",
    timestamp: new Date("2024-01-14T16:20:00"),
    type: "text",
    status: "read",
  },
];

export const chats: Chat[] = [
  {
    id: "1",
    participants: [users[0]],
    lastMessage: messages[3],
    unreadCount: 0,
  },
  {
    id: "2",
    participants: [users[1]],
    lastMessage: messages[4],
    unreadCount: 1,
  },
  {
    id: "3",
    participants: [users[2]],
    lastMessage: messages[5],
    unreadCount: 0,
  },
  {
    id: "4",
    participants: [users[3]],
    unreadCount: 0,
  },
  {
    id: "5",
    participants: [users[4]],
    unreadCount: 2,
  },
];  
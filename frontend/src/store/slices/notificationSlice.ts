import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "@/interfaces/notification.interface";
import { getUserNotificationsAPI, markNotificationAsReadAPI, markAllNotificationsAsReadAPI } from "@/api/notification.api.service";

// Interface for backend response
interface PaginatedResponse {
	success: boolean;
	data: {
		notifications: INotification[];
		total: number;
	};
}

// Interface for notifications state
interface NotificationsState {
	notifications: INotification[];
	unreadCount: number;
	isLoading: boolean;
	error: string | null;
	totalPages: number;
}

// Initial state
const initialState: NotificationsState = {
	notifications: [],
	unreadCount: 0,
	isLoading: false,
	error: null,
	totalPages: 1,
};

// Interface for fetch parameters
interface FetchParams {
	userId: string;
	page?: number;
	limit?: number;
	search?: string;
	isRead?: boolean;
}

// Thunk to fetch notifications
export const fetchNotificationsThunk = createAsyncThunk("notifications/fetchNotifications", async (params: FetchParams, { rejectWithValue }) => {
	try {
		const response = await getUserNotificationsAPI(params);
		// Ensure response has the expected structure
		if (!response.success || !response.data) {
			throw new Error("Invalid response structure from API");
		}
		return response as PaginatedResponse;
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to fetch notifications");
	}
});

// Thunk to mark a notification as read
export const markNotificationAsReadThunk = createAsyncThunk("notifications/markNotificationAsRead", async (id: string, { rejectWithValue }) => {
	try {
		await markNotificationAsReadAPI(id);
		return id;
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to mark notification as read");
	}
});

// Thunk to mark all notifications as read
export const markAllNotificationsAsReadThunk = createAsyncThunk("notifications/markAllAsRead", async (userId: string, { rejectWithValue }) => {
	try {
		await markAllNotificationsAsReadAPI(userId);
		return userId;
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to mark all as read");
	}
});

// Notifications slice
const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		// Add a new notification
		addNotification(state, action: PayloadAction<INotification>) {
			const exists = state.notifications.some((n) => n.id === action.payload.id);
			if (!exists) {
				state.notifications.unshift(action.payload);
				if (!action.payload.isRead) {
					state.unreadCount = state.unreadCount + 1;
				}
			}
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchNotificationsThunk.pending, (state) => {
				state.isLoading = true;
				state.error = null;
			})
			.addCase(fetchNotificationsThunk.fulfilled, (state, action: PayloadAction<PaginatedResponse>) => {
				state.notifications = action.payload.data.notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
				state.unreadCount = action.payload.data.notifications.filter((n) => !n.isRead).length;
				state.isLoading = false;
			})
			.addCase(fetchNotificationsThunk.rejected, (state, action) => {
				state.isLoading = false;
				state.error = action.payload as string;
			})
			.addCase(markNotificationAsReadThunk.fulfilled, (state, action: PayloadAction<string>) => {
				const id = action.payload;
				const notif = state.notifications.find((n) => n.id === id);
				if (notif && !notif.isRead) {
					notif.isRead = true;
					state.unreadCount = Math.max(0, state.unreadCount - 1);
				}
			})
			.addCase(markNotificationAsReadThunk.rejected, (state, action) => {
				state.error = action.payload as string;
			})
			.addCase(markAllNotificationsAsReadThunk.fulfilled, (state) => {
				state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
				state.unreadCount = 0;
			})
			.addCase(markAllNotificationsAsReadThunk.rejected, (state, action) => {
				state.error = action.payload as string;
			});
	},
});

export const { addNotification } = notificationsSlice.actions;
export const notificationsReducer = notificationsSlice.reducer;

// Selectors
export const selectNotifications = (state: { notifications: NotificationsState }) => state.notifications.notifications;
export const selectUnreadCount = (state: { notifications: NotificationsState }) => state.notifications.unreadCount;
export const selectNotificationsLoading = (state: { notifications: NotificationsState }) => state.notifications.isLoading;
export const selectNotificationsError = (state: { notifications: NotificationsState }) => state.notifications.error;
export const selectTotalPages = (state: { notifications: NotificationsState }) => state.notifications.totalPages;

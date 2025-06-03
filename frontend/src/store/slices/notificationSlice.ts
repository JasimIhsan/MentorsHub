import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { INotification } from "@/interfaces/INotification";
import { getUserNotificationsAPI, markNotificationAsReadAPI, markAllNotificationsAsReadAPI } from "@/api/notification.api.service";

interface NotificationsState {
	notifications: INotification[];
	unreadCount: number;
	isLoading: boolean;
	error: string | null;
}

const initialState: NotificationsState = {
	notifications: [],
	unreadCount: 0,
	isLoading: false,
	error: null,
};

// Async thunks
export const fetchNotificationsThunk = createAsyncThunk("notifications/fetchNotifications", async (userId: string, { rejectWithValue }) => {
	try {
		const data = await getUserNotificationsAPI(userId);
		return data as INotification[];
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to fetch notifications");
	}
});

export const markNotificationAsReadThunk = createAsyncThunk("notifications/markNotificationAsRead", async (id: string, { rejectWithValue }) => {
	try {
		await markNotificationAsReadAPI(id);
		return id;
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to mark notification as read");
	}
});

export const markAllNotificationsAsReadThunk = createAsyncThunk("notifications/markAllAsRead", async (userId: string, { rejectWithValue }) => {
	try {
		await markAllNotificationsAsReadAPI(userId);
		return userId;
	} catch (error: any) {
		return rejectWithValue(error.message || "Failed to mark all as read");
	}
});

const notificationsSlice = createSlice({
	name: "notifications",
	initialState,
	reducers: {
		addNotification(state, action: PayloadAction<INotification>) {
			const exists = state.notifications.some((n) => n.id === action.payload.id);
			if (!exists) {
				state.notifications.unshift(action.payload);
				if (state.notifications.length > 5) {
					state.notifications.pop();
				}
				if (!action.payload.isRead) {
					state.unreadCount++;
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
			.addCase(fetchNotificationsThunk.fulfilled, (state, action: PayloadAction<INotification[]>) => {
				state.notifications = action.payload.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
				state.unreadCount = state.notifications.filter((n) => !n.isRead).length;
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

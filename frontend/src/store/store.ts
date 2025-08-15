// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/userSlice";
import adminAuthReducer from "@/store/slices/adminSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { notificationsReducer } from "./slices/notificationSlice";

const persistConfig = {
	key: "root",
	storage,
};

const persistedAuthReducer = persistReducer(persistConfig, authReducer);
const persistedAdminAuthReducer = persistReducer(persistConfig, adminAuthReducer);
const persistedNotificationReducer = persistReducer(persistConfig, notificationsReducer)

export const store = configureStore({
	reducer: {
		userAuth: persistedAuthReducer,
		adminAuth: persistedAdminAuthReducer,
		notifications: persistedNotificationReducer
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				// Ignore redux-persist non-serializable actions
				ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
			},
		}),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

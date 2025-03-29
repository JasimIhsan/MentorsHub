// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "@/store/slices/authSlice";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage

// Persist configuration
const persistConfig = {
	key: "root", // Key for the persisted state in storage
	storage, // Use localStorage (or sessionStorage if preferred)
	// whitelist: ["auth"], // Only persist the 'auth' slice
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
	reducer: {
		auth: persistedReducer,
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

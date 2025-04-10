import { UserInterface } from "@/interfaces/interfaces";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

// Create a type that excludes password from UserInterface
type UserWithoutPassword = Omit<UserInterface, "password">;

interface AuthState {
	isAuthenticated: boolean;
	user: Partial<UserWithoutPassword> | null;
}

const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
};

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<Partial<UserWithoutPassword>>) {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		logout(state) {
			state.isAuthenticated = false;
			state.user = null;
		},
		updateUser(state, action: PayloadAction<Partial<UserWithoutPassword>>) {
			if (state.user) {
				state.isAuthenticated = true;
				state.user = { ...state.user, ...action.payload };
			}
		},
		updateUserIsAuthenticated(state) {
			state.isAuthenticated = !state.isAuthenticated;
		},
		removeUserData(state) {
			state.user = null;
		},
	},
});

export const { login, logout, updateUser, removeUserData, updateUserIsAuthenticated } = authSlice.actions;
export default authSlice.reducer;

export const getFullName = (state: RootState) => {
	if (state.auth.user) {
		return `${state.auth.user.firstName} ${state.auth.user.lastName}`;
	}
	return "";
};

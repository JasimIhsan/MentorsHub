import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { UserInterface } from "@/interfaces/interfaces";
import { RootState } from "../store";
import axiosInstance from "@/api/api.config";

// Type without password
type UserWithoutPassword = Omit<UserInterface, "password">;

interface AuthState {
	isAuthenticated: boolean;
	user: Partial<UserWithoutPassword> | null;
	loading: boolean;
	error: string | null;
}

// ✅ Make sure loading and error are included
const initialState: AuthState = {
	isAuthenticated: false,
	user: null,
	loading: false,
	error: null,
};

// ✅ Async thunk to fetch user profile
export const fetchUserProfile = createAsyncThunk<UserWithoutPassword, void, { rejectValue: string }>("auth/fetchUserProfile", async (_, thunkAPI) => {
	try {
		const response = await axiosInstance.get("/user-profile", {
			withCredentials: true,
		});
		return response.data;
	} catch (error) {
		return thunkAPI.rejectWithValue("Failed to fetch user profile");
	}
});

const userSlice = createSlice({
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
				state.user = { ...state.user, ...action.payload };
			}
		},
		updateRole(state, action: PayloadAction<"user" | "mentor">) {
			if (state.user) {
				state.user.role = action.payload;
			}
		},
		removeUserData(state) {
			state.user = null;
		},
		updateUserIsAuthenticated(state) {
			state.isAuthenticated = !state.isAuthenticated;
		},
	},
	extraReducers: (builder) => {
		// ✅ Correct usage of builder.addCase
		builder
			.addCase(fetchUserProfile.pending, (state) => {
				state.loading = true;
				state.error = null;
			})
			.addCase(fetchUserProfile.fulfilled, (state, action) => {
				state.loading = false;
				state.isAuthenticated = true;
				state.user = { ...action.payload };
			})
			.addCase(fetchUserProfile.rejected, (state, action) => {
				state.loading = false;
				state.error = action.payload || "Unknown error";
			});
	},
});

export const { login, logout, updateUser, removeUserData, updateUserIsAuthenticated, updateRole } = userSlice.actions;

export default userSlice.reducer;

export const getFullName = (state: RootState) => {
	if (state.auth.user) {
		return `${state.auth.user.firstName} ${state.auth.user.lastName}`;
	}
	return "";
};

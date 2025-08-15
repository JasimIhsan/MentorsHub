import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { getUserProfileApi } from "@/api/user/user.profile.api.service";
import { IUserDTO } from "@/interfaces/user.interface";

interface AuthState {
	isAuthenticated: boolean;
	user: Partial<IUserDTO> | null;
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
export const fetchUserProfile = createAsyncThunk<IUserDTO, void, { state: RootState; rejectValue: string }>("auth/fetchUserProfile", async (_, thunkAPI) => {
	try {
		// Access the current state to get the user ID
		const state = thunkAPI.getState();
		const userId = state.userAuth.user?.id;

		if (!userId) {
			return thunkAPI.rejectWithValue("User ID not found");
		}

		const response = await getUserProfileApi(userId);
		console.log("response: ", response);
		return response.user;
	} catch (error) {
		return thunkAPI.rejectWithValue("Failed to fetch user profile");
	}
});

const userSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login(state, action: PayloadAction<Partial<IUserDTO>>) {
			state.isAuthenticated = true;
			state.user = action.payload;
		},
		logout(state) {
			state.isAuthenticated = false;
			state.user = null;
		},
		updateUser(state, action: PayloadAction<Partial<IUserDTO>>) {
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
				console.error("Error fetching user profile:", action.payload);
				state.loading = false;
				state.error = action.payload || "Unknown error";
			});
	},
});

export const { login, logout, updateUser, removeUserData, updateUserIsAuthenticated, updateRole } = userSlice.actions;

export default userSlice.reducer;

export const getFullName = (state: RootState) => {
	if (state.userAuth.user) {
		return `${state.userAuth.user.firstName} ${state.userAuth.user.lastName}`;
	}
	return "";
};

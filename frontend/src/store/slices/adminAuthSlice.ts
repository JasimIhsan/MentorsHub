import { createSlice } from "@reduxjs/toolkit";

import { IAdmin } from "@/interfaces/Iadmin";

interface AdminState {
	isAuthenticated: boolean;
	admin: IAdmin | null;
}

const initialState: AdminState = {
	isAuthenticated: false,
	admin: null,
};

const adminAuthSlice = createSlice({
	name: "adminAuth",
	initialState,
	reducers: {
		adminLogin(state, action) {
			state.isAuthenticated = true;
			state.admin = action.payload;
		},
		adminLogout(state) {
			state.isAuthenticated = false;
			state.admin = null;
		},
		// updateAdmin(state, action: PayloadAction<any>) {
		// 	if (state.admin) {
		// 		state.admin = { ...state.admin, ...action.payload };
		// 	}
		// },
		// updateAdminIsAuthenticated(state) {
		// 	state.isAuthenticated = !state.isAuthenticated;
		// },
	},
});

export const { adminLogin, adminLogout } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../api/supabaseClient";

interface AuthState {
    isLoggedIn: boolean;
    email?: string;
}

const initialState: AuthState = {
    isLoggedIn: false,
    email: undefined,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login(state, action: PayloadAction<{ userEmail: string }>) {
            state.isLoggedIn = true;
            state.email = action.payload.userEmail;
        },

        logout(state) {
            state.isLoggedIn = false;
            state.email = undefined;
            supabase.auth.signOut();
        },
    },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
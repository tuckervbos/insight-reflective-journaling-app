import { create } from "zustand";
import { login, logout, signup, fetchAuthenticatedUser } from "../utils/api";

const useSessionStore = create((set) => ({
	user: null,
	loading: true,

	// this function allows us to manually update user state
	setUser: (user) => set({ user }),

	authenticate: async () => {
		try {
			const user = await fetchAuthenticatedUser(); // Uses auth API
			set({ user, loading: false });
		} catch (error) {
			set({ user: null, loading: false });
		}
	},

	login: async (credentials) => {
		try {
			const response = await login(credentials);
			if (!response.errors) {
				set({ user: response });
				return { success: true };
			}
			return { success: false, errors: response.errors };
		} catch (error) {
			console.error("Login error:", error);
			return { success: false, errors: { server: "An error occurred." } };
		}
	},

	signup: async (userData) => {
		try {
			const response = await signup(userData);
			if (!response.errors) {
				set({ user: response });
				return { success: true };
			}
			return { success: false, errors: response.errors };
		} catch (error) {
			console.error("Signup error:", error);
			return { success: false, errors: { server: "An error occurred." } };
		}
	},

	logout: async () => {
		try {
			await logout();
			set({ user: null });
		} catch (error) {
			console.error("Logout error:", error);
		}
	},
}));

export default useSessionStore;

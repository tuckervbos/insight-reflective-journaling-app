import { create } from "zustand";
import { authenticate, login, logout, signup } from "../utils/api";

const useSessionStore = create((set) => ({
	user: null,
	// this function allows us to manually update user state
	setUser: (user) => set({ user }),

	authenticate: async () => {
		try {
			const user = await authenticate();
			set({ user }); // set user if authenticated, or null otherwise
		} catch (error) {
			console.error("Authentication error:", error);
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

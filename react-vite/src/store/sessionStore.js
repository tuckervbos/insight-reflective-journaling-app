import { create } from "zustand";
import {
	login,
	logout,
	signup,
	fetchAuthenticatedUser,
	updateUser,
	updatePassword,
	deleteUser,
} from "../utils/api";
import { csrfToken, getCsrfToken } from "../utils/api";

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
	// Update user profile
	updateProfile: async (updatedData) => {
		try {
			if (!updatedData) throw new Error("No updated data provided");

			const user = await updateUser(updatedData.id, updatedData);
			if (user) {
				set({ user });
				return { success: true };
			} else {
				return {
					success: false,
					errors: { server: "Failed to update user profile." },
				};
			}
		} catch (error) {
			return { success: false, errors: { server: "An error occurred." } };
		}
	},

	// Update user password
	updatePassword: async (id, oldPassword, newPassword) => {
		try {
			if (!csrfToken) await getCsrfToken();
			const result = await updatePassword(id, oldPassword, newPassword);
			if (result) {
				return { success: true };
			} else {
				throw new Error("Failed to update password.");
			}
		} catch (error) {
			return {
				success: false,
				errors: { server: "Failed to update password." },
			};
		}
	},

	// Delete user account
	deleteUser: async (id) => {
		try {
			await deleteUser(id);
			set({ user: null });
			return { success: true };
		} catch (error) {
			return {
				success: false,
				errors: { server: "Failed to delete user account." },
			};
		}
	},
}));

export default useSessionStore;

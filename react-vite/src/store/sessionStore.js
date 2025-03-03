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
	// Update user profile
	updateProfile: async (updatedData) => {
		try {
			console.log("Preparing to update user profile:", updatedData);
			if (!updatedData) throw new Error("No updated data provided");

			const user = await updateUser(updatedData.id, updatedData);
			if (user) {
				set({ user });
				console.log("User profile updated successfully:", user);
				return { success: true };
			} else {
				console.error("Failed to update user profile.");
				return {
					success: false,
					errors: { server: "Failed to update user profile." },
				};
			}
		} catch (error) {
			console.error("Error updating profile:", error);
			return { success: false, errors: { server: "An error occurred." } };
		}
	},

	// Update user password
	updatePassword: async (id, oldPassword, newPassword) => {
		try {
			console.log("Updating password for user ID:", id);
			const result = await updatePassword(id, oldPassword, newPassword);
			if (result) {
				console.log("Password updated successfully for user ID:", id);
				return { success: true };
			} else {
				throw new Error("Failed to update password.");
			}
		} catch (error) {
			console.error("Error updating password:", error);
			return {
				success: false,
				errors: { server: "Failed to update password." },
			};
		}
	},

	// Delete user account
	deleteUser: async (id) => {
		try {
			console.log("Deleting user account with ID:", id);
			await deleteUser(id);
			set({ user: null }); // Clear the user from the session store
			console.log("User account deleted successfully.");
			return { success: true };
		} catch (error) {
			console.error("Error deleting user:", error);
			return {
				success: false,
				errors: { server: "Failed to delete user account." },
			};
		}
	},
}));

export default useSessionStore;

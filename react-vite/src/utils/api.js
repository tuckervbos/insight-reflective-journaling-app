let csrfToken = null; // Global variable to store the CSRF token

// ------------------------------ auth --------------------------------

// Fetch the CSRF token from the backend
export const getCsrfToken = async () => {
	try {
		const response = await fetch("/api/auth/csrf/restore", {
			method: "GET",
			credentials: "include", // include cookies in request
		});
		if (!response.ok) {
			throw new Error("Failed to fetch CSRF token.");
		}
		const data = await response.json();
		csrfToken = data.csrf_token; // store the csrf token globally
		// document.cookie = `csrf_token=${csrfToken}; path=/`; // optionally set it in cookies
		sessionStorage.setItem("csrf_token", csrfToken);

		console.log("✅ CSRF Token stored:", csrfToken);
	} catch (error) {
		console.error("Error fetching CSRF token:", error);
		throw error;
	}
};

// Helper function to retrieve the token from sessionStorage
export const getStoredCsrfToken = () => {
	return sessionStorage.getItem("csrf_token");
};

// authenticate the user session
export const authenticate = async () => {
	try {
		const response = await fetch("/api/auth", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken, // include csrf token in headers
			},
			credentials: "include", // include cookies
		});
		if (response.status === 401) {
			console.warn("No user authenticated.");
			return null;
		}
		if (!response.ok) {
			throw new Error("Failed to authenticate.");
		}
		const user = await response.json();
		return user;
	} catch (error) {
		console.error("Error during authentication:", error);
		throw error;
	}
};

// perform user login
export const login = async (credentials) => {
	try {
		// ensure csrf token is available
		if (!csrfToken) {
			await getCsrfToken(); // fetch it if not already set
		}

		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken, // include csrf token in headers
			},
			credentials: "include", // include cookies
			body: JSON.stringify(credentials),
		});
		if (!response.ok) {
			const errors = await response.json();
			return errors;
		}
		return await response.json(); // return user data on success
	} catch (error) {
		console.error("Error during login:", error);
		return { server: "An error occurred. Please try again later." };
	}
};

// perform user logout
export const logout = async () => {
	try {
		if (!csrfToken) {
			await getCsrfToken();
		}
		const response = await fetch("/api/auth/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken, // include CSRF token
			},
			credentials: "include", // include cookies
		});
		if (!response.ok) {
			throw new Error("Logout failed.");
		}
		return null; // indicate success
	} catch (error) {
		console.error("Logout error:", error);
		return { message: error.message };
	}
};

// Sign up a new user
export const signup = async (userData) => {
	try {
		// ensure csrf token is available
		if (!csrfToken) {
			await getCsrfToken(); // fetch it if not already set
		}

		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include", // include cookies
			body: JSON.stringify(userData), // send user data
		});

		if (!response.ok) {
			const errors = await response.json();
			return { errors };
		}

		const user = await response.json();
		return user;
	} catch (error) {
		console.error("Error during signup:", error);
		return { errors: { server: "An error occurred. Please try again later." } };
	}
};

// ------------------------------ entries --------------------------------

export const fetchEntries = async () => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch("/api/entries", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch entries.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching entries:", error);
		throw error;
	}
};

// create a new entry
export const createEntry = async (entryData, location) => {
	try {
		if (!csrfToken) await getCsrfToken();

		const response = await fetch("/api/entries", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify({ ...entryData, location }),
		});
		if (!response.ok) throw new Error("Failed to create entry.");
		return await response.json();
	} catch (error) {
		console.error("Error creating entry:", error);
		throw error;
	}
};

// Update an entry
export const updateEntry = async (id, updatedData) => {
	try {
		if (!csrfToken) await getCsrfToken();

		const response = await fetch(`/api/entries/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(updatedData),
		});
		if (!response.ok) throw new Error("Failed to update entry.");
		return await response.json();
	} catch (error) {
		console.error("Error updating entry:", error);
		throw error;
	}
};

// Delete an entry
export const deleteEntry = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();

		const response = await fetch(`/api/entries/${id}`, {
			method: "DELETE",
			headers: {
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to delete entry.");
		return { success: true };
	} catch (error) {
		console.error("Error deleting entry:", error);
		throw error;
	}
};

// ------------------------------ users --------------------------------

// Fetch user details by ID
export const fetchUser = async (id) => {
	try {
		const response = await fetch(`/api/users/${id}`, {
			method: "GET",
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch user.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching user:", error);
		throw error;
	}
};

// Fetch authenticated user details
export const fetchAuthenticatedUser = async () => {
	try {
		const response = await fetch("/api/auth", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to authenticate user.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching authenticated user:", error);
		throw error;
	}
};

// Update user details (email, username)
export const updateUser = async (id, updatedData) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/users/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(updatedData),
		});
		if (!response.ok) throw new Error("Failed to update user.");
		return await response.json();
	} catch (error) {
		console.error("Error updating user:", error);
		throw error;
	}
};

// Update password
export const updatePassword = async (id, oldPassword, newPassword) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/users/${id}/password`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify({
				old_password: oldPassword,
				new_password: newPassword,
			}),
		});
		if (!response.ok) throw new Error("Failed to update password.");
		return await response.json();
	} catch (error) {
		console.error("Error updating password:", error);
		throw error;
	}
};

// Delete user
export const deleteUser = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/users/${id}`, {
			method: "DELETE",
			headers: {
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to delete user.");
		return { success: true };
	} catch (error) {
		console.error("Error deleting user:", error);
		throw error;
	}
};

// Export all functions
export default {
	getCsrfToken,
	authenticate,
	login,
	logout,
	signup,
	fetchEntries,
	createEntry,
	updateEntry,
	deleteEntry,
	fetchUser,
	updateUser,
	updatePassword,
	deleteUser,
	fetchAuthenticatedUser,
};

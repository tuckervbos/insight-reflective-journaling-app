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
		return;
	} catch (error) {
		console.error("Error fetching CSRF token:", error);
		throw error;
	}
};

export { csrfToken };

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

// Fetch a specific entry by ID
export const fetchEntryById = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/entries/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch entry.");
		const entry = await response.json();
		console.log("Fetched Entry:", entry);
		return entry;
	} catch (error) {
		console.error("Error fetching entry by ID:", error);
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

// ------------------------------ goals --------------------------------

// Fetch all goals with pagination
export const fetchGoals = async (page = 1, perPage = 10) => {
	try {
		if (!csrfToken) await getCsrfToken(); // Ensure CSRF token is set
		const response = await fetch(
			`/api/goals?page=${page}&per_page=${perPage}`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"X-CSRF-TOKEN": csrfToken,
				},
				credentials: "include",
			}
		);
		if (!response.ok) throw new Error("Failed to fetch goals.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching goals:", error);
		throw error;
	}
};

// Fetch a specific goal by ID
export const fetchGoalById = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		console.log("Making API call to:", `/api/goals/${id}`);
		console.log("Using CSRF Token:", csrfToken);

		const response = await fetch(`/api/goals/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});

		console.log("API Response Status:", response.status);

		if (!response.ok) {
			console.error("Failed to fetch goal. Status:", response.status);
			console.error("Response Text:", await response.text());
			return null; // Return null explicitly if the fetch fails
		}

		const data = await response.json();
		console.log("Fetched Goal Data in API:", data); // Verify data is being parsed correctly
		return data; // Ensure the data is returned correctly
	} catch (error) {
		console.error("Error fetching goal:", error);
		return null; // Explicitly return null on error
	}
};

// Create a new goal
export const createGoal = async (goalData) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch("/api/goals", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(goalData),
		});
		if (!response.ok) throw new Error("Failed to create goal.");
		return await response.json();
	} catch (error) {
		console.error("Error creating goal:", error);
		throw error;
	}
};

// Update an existing goal
export const updateGoal = async (id, updatedData) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/goals/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(updatedData),
		});
		if (!response.ok) throw new Error("Failed to update goal.");
		return await response.json();
	} catch (error) {
		console.error("Error updating goal:", error);
		throw error;
	}
};

// Delete a goal
export const deleteGoal = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/goals/${id}`, {
			method: "DELETE",
			headers: {
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to delete goal.");
		return { success: true };
	} catch (error) {
		console.error("Error deleting goal:", error);
		throw error;
	}
};

// Fetch goals associated with a specific entry
export const fetchGoalsForEntry = async (entryId) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/goals/entry/${entryId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch goals for entry.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching goals for entry:", error);
		throw error;
	}
};

// Fetch entries associated with a specific goal
export const fetchEntriesForGoal = async (goalId) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/entries/goal/${goalId}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch entries for goal.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching entries for goal:", error);
		return [];
	}
};

// ------------------------------ milestones --------------------------------

// Fetch all milestones
export const fetchMilestones = async (status = null) => {
	try {
		if (!csrfToken) await getCsrfToken(); // Ensure CSRF token is set
		const url = status ? `/api/milestones?status=${status}` : "/api/milestones";
		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch milestones.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching milestones:", error);
		throw error;
	}
};

// Fetch a specific milestone by ID
export const fetchMilestoneById = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/milestones/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch milestone.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching milestone by ID:", error);
		throw error;
	}
};

// Create a new milestone
export const createMilestone = async (milestoneData) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch("/api/milestones", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(milestoneData),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to create milestone.");
		}
		return await response.json();
	} catch (error) {
		console.error("Error creating milestone:", error);
		throw error;
	}
};

// Update an existing milestone
export const updateMilestone = async (id, updatedData) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/milestones/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(updatedData),
		});
		if (!response.ok) throw new Error("Failed to update milestone.");
		return await response.json();
	} catch (error) {
		console.error("Error updating milestone:", error);
		throw error;
	}
};

// Delete a milestone
export const deleteMilestone = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/milestones/${id}`, {
			method: "DELETE",
			headers: {
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to delete milestone.");
		return { success: true };
	} catch (error) {
		console.error("Error deleting milestone:", error);
		throw error;
	}
};

// ------------------------------ AI Insights --------------------------------

export const fetchInsights = async () => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch("/api/insights", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch insights.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching insights:", error);
		throw error;
	}
};

export const fetchInsightById = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/insights/${id}`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to fetch insight.");
		return await response.json();
	} catch (error) {
		console.error("Error fetching insight by ID:", error);
		throw error;
	}
};

export const createInsight = async (data) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch("/api/insights", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(data),
		});
		if (!response.ok) {
			const error = await response.json();
			throw new Error(error.error || "Failed to create insight.");
		}
		return await response.json();
	} catch (error) {
		console.error("Error creating insight:", error);
		throw error;
	}
};

export const updateInsight = async (id, updatedData) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/insights/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
			body: JSON.stringify(updatedData),
		});
		if (!response.ok) throw new Error("Failed to update insight.");
		return await response.json();
	} catch (error) {
		console.error("Error updating insight:", error);
		throw error;
	}
};

export const deleteInsight = async (id) => {
	try {
		if (!csrfToken) await getCsrfToken();
		const response = await fetch(`/api/insights/${id}`, {
			method: "DELETE",
			headers: {
				"X-CSRF-TOKEN": csrfToken,
			},
			credentials: "include",
		});
		if (!response.ok) throw new Error("Failed to delete insight.");
		return { success: true };
	} catch (error) {
		console.error("Error deleting insight:", error);
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
	fetchEntryById,
	createEntry,
	updateEntry,
	deleteEntry,
	fetchUser,
	updateUser,
	updatePassword,
	deleteUser,
	fetchAuthenticatedUser,
	fetchGoals,
	fetchGoalById,
	createGoal,
	updateGoal,
	deleteGoal,
	fetchGoalsForEntry,
	fetchEntriesForGoal,
	fetchMilestones,
	fetchMilestoneById,
	createMilestone,
	updateMilestone,
	deleteMilestone,
	fetchInsights,
	fetchInsightById,
	createInsight,
	updateInsight,
	deleteInsight,
};

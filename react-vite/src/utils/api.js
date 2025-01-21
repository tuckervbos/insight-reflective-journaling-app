let csrfToken = null; // Global variable to store the CSRF token

// Fetch the CSRF token from the backend
export const getCsrfToken = async () => {
	try {
		const response = await fetch("/api/auth/csrf/restore", {
			method: "GET",
			credentials: "include", // Include cookies in the request
		});
		if (!response.ok) {
			throw new Error("Failed to fetch CSRF token.");
		}
		const data = await response.json();
		csrfToken = data.csrf_token; // Store the CSRF token globally
		console.log("CSRF token fetched successfully:", csrfToken);
		document.cookie = `csrf_token=${csrfToken}; path=/`; // Optionally set it in cookies
	} catch (error) {
		console.error("Error fetching CSRF token:", error);
		throw error;
	}
};

// Authenticate the user session
export const authenticate = async () => {
	try {
		const response = await fetch("/api/auth/", {
			method: "GET",
			credentials: "include", // Include cookies
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

// Perform user login
export const login = async (credentials) => {
	try {
		// Ensure CSRF token is available
		if (!csrfToken) {
			await getCsrfToken(); // Fetch it if not already set
		}

		const response = await fetch("/api/auth/login", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken, // Include CSRF token in headers
			},
			credentials: "include", // Include cookies
			body: JSON.stringify(credentials),
		});
		if (!response.ok) {
			const errors = await response.json();
			return errors; // Return errors if login fails
		}
		return await response.json(); // Return user data on success
	} catch (error) {
		console.error("Error during login:", error);
		return { server: "An error occurred. Please try again later." };
	}
};

// Perform user logout
export const logout = async () => {
	try {
		const response = await fetch("/api/auth/logout", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Include cookies
		});
		if (!response.ok) {
			throw new Error("Logout failed.");
		}
		return null; // Indicate success
	} catch (error) {
		console.error("Logout error:", error);
		return { message: error.message }; // Return errors
	}
};

// Sign up a new user
export const signup = async (userData) => {
	try {
		// Ensure CSRF token is available
		if (!csrfToken) {
			await getCsrfToken(); // Fetch it if not already set
		}

		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": csrfToken, // Include CSRF token in headers
			},
			credentials: "include", // Include cookies
			body: JSON.stringify(userData), // Send user data
		});

		// Handle non-OK responses
		if (!response.ok) {
			const errors = await response.json();
			return { errors }; // Return errors for form validation
		}

		// Return user data on successful signup
		const user = await response.json();
		return user;
	} catch (error) {
		console.error("Error during signup:", error);
		return { errors: { server: "An error occurred. Please try again later." } };
	}
};

export default {
	getCsrfToken,
	authenticate,
	login,
	logout,
	signup, // Include signup in the default export
};

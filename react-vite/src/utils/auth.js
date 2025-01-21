import { login, getCsrfToken } from "./api"; // Assuming './api' contains the login and getCsrfToken utilities

export const handleLogin = async (email, password) => {
	try {
		// Step 1: Ensure CSRF Token is ready
		await getCsrfToken();

		// Step 2: Make the login request
		const response = await login({ email, password });

		if (response) {
			if (response.errors) {
				console.error("Login failed:", response.errors);
				return { success: false, errors: response.errors }; // Return errors to the caller
			} else {
				console.log("Login successful!");
				return { success: true }; // Indicate success
			}
		}
	} catch (error) {
		console.error("An unexpected error occurred during login:", error);
		return {
			success: false,
			errors: { server: "An unexpected error occurred." },
		};
	}
};

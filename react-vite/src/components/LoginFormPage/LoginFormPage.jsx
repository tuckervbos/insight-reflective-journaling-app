import { useState } from "react";
import { login, authenticate } from "../../utils/api";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStore from "../../store/sessionStore";

function LoginFormPage() {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const user = useSessionStore((state) => state.user);
	const setUser = useSessionStore((state) => state.setUser);

	// Redirect if already logged in
	if (user) return <Navigate to="/home" replace={true} />;

	// Handle form submission for login
	const handleSubmit = async (e) => {
		e.preventDefault();

		// Perform login
		const response = await login({ email, password });
		if (response?.errors) {
			console.error("Login failed:", response.errors);
			setErrors(response.errors); // Display errors
		} else {
			// Authenticate and update session
			const user = await authenticate();
			if (!user) {
				console.warn("No user authenticated. Redirecting to login...");
				setErrors({ server: "Login failed. Please try again." }); // Add server error
			} else {
				setUser(user); // Update global state
				navigate("/home"); // Redirect to homepage
			}
		}
	};

	return (
		<>
			<h1>Log In</h1>
			{errors.server && <p className="error">{errors.server}</p>}
			<form onSubmit={handleSubmit}>
				<label>
					Email
					<input
						type="text"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<button type="submit">Log In</button>
				{errors.email && <p className="error">{errors.email.join(", ")}</p>}
				{errors.password && (
					<p className="error">{errors.password.join(", ")}</p>
				)}
			</form>
		</>
	);
}

export default LoginFormPage;

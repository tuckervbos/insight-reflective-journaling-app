import { useState } from "react";
import useSessionStore from "../../store/sessionStore";
import { signup } from "../../utils/api";
import { useNavigate } from "react-router-dom";

function SignupFormPage() {
	const navigate = useNavigate();
	const { setUser } = useSessionStore();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (password !== confirmPassword) {
			setErrors({ confirmPassword: "Passwords must match" });
			return;
		}
		try {
			const response = await signup({ email, username, password });
			if (response.errors) {
				setErrors(response.errors);
			} else {
				setUser(response);
				navigate("/home");
			}
		} catch (error) {
			setErrors({ general: "Signup failed. Please try again." });
		}
	};

	return (
		<>
			<h1>Sign Up</h1>
			{errors.general && <p className="error">{errors.general}</p>}
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
				{errors.email && <p className="error">{errors.email}</p>}
				<label>
					Username
					<input
						type="text"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				</label>
				{errors.username && <p className="error">{errors.username}</p>}
				<label>
					Password
					<input
						type="password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						required
					/>
				</label>
				<label>
					Confirm Password
					<input
						type="password"
						value={confirmPassword}
						onChange={(e) => setConfirmPassword(e.target.value)}
						required
					/>
				</label>
				{errors.confirmPassword && (
					<p className="error">{errors.confirmPassword}</p>
				)}
				<button type="submit">Sign Up</button>
			</form>
		</>
	);
}

export default SignupFormPage;

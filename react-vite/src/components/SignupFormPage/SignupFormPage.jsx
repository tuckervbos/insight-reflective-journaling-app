import { useState } from "react";
import useSessionStore from "../../store/sessionStore";
import { signup } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { GlowCard, GlowButton, GlowInput } from "../UIComponents";

const SignupFormPage = () => {
	const navigate = useNavigate();
	const { setUser } = useSessionStore();
	const [email, setEmail] = useState("");
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [errors, setErrors] = useState({});

	const handleSubmit = async (e) => {
		e.preventDefault();
		let validationErrors = {};

		if (!email.trim()) {
			validationErrors.email = "Email is required.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			validationErrors.email = "Invalid email format.";
		}

		if (!username.trim()) {
			validationErrors.username = "Username is required.";
		} else if (username.length < 3) {
			validationErrors.username = "Username must be at least 3 characters.";
		}

		if (!password.trim()) {
			validationErrors.password = "Password is required.";
		} else if (password.length < 6) {
			validationErrors.password = "Password must be at least 6 characters.";
		}

		if (confirmPassword !== password) {
			validationErrors.confirmPassword = "Passwords must match.";
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
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
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<GlowCard className="w-full max-w-md p-6">
				<h2 className="text-violet-400 text-2xl font-semibold mb-4 text-center">
					Sign Up
				</h2>
				{errors.general && (
					<p className="text-red-500 text-sm">{errors.general}</p>
				)}
				<form onSubmit={handleSubmit} className="space-y-4">
					<div>
						<label className="block text-sm text-gray-400">Email</label>
						<GlowInput
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
							required
						/>
						{errors.email && (
							<p className="text-red-500 text-xs">{errors.email}</p>
						)}
					</div>
					<div>
						<label className="block text-sm text-gray-400">Username</label>
						<GlowInput
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
							required
						/>
						{errors.username && (
							<p className="text-red-500 text-xs">{errors.username}</p>
						)}
					</div>
					<div>
						<label className="block text-sm text-gray-400">Password</label>
						<GlowInput
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-600"
							required
						/>
						{errors.password && (
							<p className="text-red-500 text-xs">{errors.password}</p>
						)}
					</div>
					<div>
						<label className="block text-sm text-gray-400">
							Confirm Password
						</label>
						<GlowInput
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
							required
						/>
						{errors.confirmPassword && (
							<p className="text-red-500 text-xs">{errors.confirmPassword}</p>
						)}
					</div>
					<GlowButton type="submit" className="w-full">
						Sign Up
					</GlowButton>
				</form>
			</GlowCard>
		</div>
	);
};

export default SignupFormPage;

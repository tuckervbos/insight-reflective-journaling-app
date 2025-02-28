import { useState } from "react";
import { login, authenticate } from "../../utils/api";
import { Navigate, useNavigate } from "react-router-dom";
import useSessionStore from "../../store/sessionStore";
import { GlowCard, GlowButton, GlowInput } from "../UIComponents";

const LoginFormPage = () => {
	const navigate = useNavigate();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState({});
	const user = useSessionStore((state) => state.user);
	const setUser = useSessionStore((state) => state.setUser);

	// Redirect if already logged in
	if (user) return <Navigate to="/home" replace={true} />;

	// Handle login
	const handleSubmit = async (e) => {
		e.preventDefault();
		let validationErrors = {};

		if (!email.trim()) {
			validationErrors.email = "Email is required.";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			validationErrors.email = "Invalid email format.";
		}

		if (!password.trim()) {
			validationErrors.password = "Password is required.";
		} else if (password.length < 6) {
			validationErrors.password = "Password must be at least 6 characters.";
		}

		if (Object.keys(validationErrors).length > 0) {
			setErrors(validationErrors);
			return;
		}

		const response = await login({ email, password });
		if (response?.errors) {
			setErrors(response.errors);
		} else {
			const user = await authenticate();
			if (!user) {
				setErrors({ server: "Login failed. Please try again." });
			} else {
				setUser(user);
				navigate("/home");
			}
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<GlowCard className="w-full max-w-md p-6">
				<h2 className="text-violet-400 text-2xl font-semibold mb-4 text-center">
					Log In
				</h2>
				{errors.server && (
					<p className="text-red-500 text-sm">{errors.server}</p>
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
						<label className="block text-sm text-gray-400">Password</label>
						<GlowInput
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
							required
						/>
						{errors.password && (
							<p className="text-red-500 text-xs">{errors.password}</p>
						)}
					</div>
					<GlowButton type="submit" className="w-full">
						Log In
					</GlowButton>
				</form>
				<p className="text-sm text-gray-400 mt-4 text-center">
					Don&apos;t have an account?{" "}
					<span
						className="text-violet-400 cursor-pointer"
						onClick={() => navigate("/signup")}
					>
						Sign up here
					</span>
				</p>
			</GlowCard>
		</div>
	);
};

export default LoginFormPage;

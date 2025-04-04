import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useSessionStore from "../../store/sessionStore";
import { GlowCard, GlowButton, GlowInput } from "../UIComponents";

const UpdateProfilePage = () => {
	const user = useSessionStore((state) => state.user);
	const updateProfile = useSessionStore((state) => state.updateProfile);
	const [username, setUsername] = useState(user?.username || "");
	const [email, setEmail] = useState(user?.email || "");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);
		setLoading(true);

		if (!username.trim()) {
			setError("Username is required.");
			setLoading(false);
			return;
		}

		if (!email.trim()) {
			setError("Email is required.");
			setLoading(false);
			return;
		}

		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			setError("Please enter a valid email address.");
			setLoading(false);
			return;
		}

		try {
			const result = await updateProfile({ id: user?.id, username, email });

			if (result?.success) {
				setSuccess("Profile updated successfully!");
				setTimeout(() => navigate("/profile"), 1000);
			} else {
				throw new Error(result?.errors?.server || "Failed to update profile");
			}
		} catch (err) {
			setError("Failed to update profile. Try again.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<GlowCard className="w-full max-w-lg p-6">
				<h2 className="text-violet-400 text-2xl font-semibold mb-4 text-center">
					Update Profile
				</h2>
				<form onSubmit={handleUpdateProfile} className="space-y-4">
					<div>
						<label className="block text-sm text-gray-400">Username</label>
						<GlowInput
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-400">Email</label>
						<GlowInput
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && <p className="text-green-500 text-sm">{success}</p>}
					<GlowButton type="submit" className="w-full" disabled={loading}>
						{loading ? "Updating..." : "Update Profile"}
					</GlowButton>
				</form>
			</GlowCard>
		</div>
	);
};

export default UpdateProfilePage;

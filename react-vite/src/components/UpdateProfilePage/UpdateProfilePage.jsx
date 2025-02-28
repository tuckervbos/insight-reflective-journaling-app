import { useState } from "react";
import useSessionStore from "../../store/sessionStore";
import { GlowCard, GlowButton } from "../UIComponents";

const UpdateProfilePage = () => {
	const user = useSessionStore((state) => state.user);
	const updateProfile = useSessionStore((state) => state.updateProfile);
	const [username, setUsername] = useState(user?.username || "");
	const [email, setEmail] = useState(user?.email || "");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);

	const handleUpdateProfile = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		try {
			await updateProfile({ username, email });
			setSuccess("Profile updated successfully!");
		} catch (err) {
			setError("Failed to update profile. Try again.");
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
						<input
							type="text"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-400">Email</label>
						<input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && <p className="text-green-500 text-sm">{success}</p>}
					<GlowButton type="submit" className="w-full">
						Update Profile
					</GlowButton>
				</form>
			</GlowCard>
		</div>
	);
};

export default UpdateProfilePage;

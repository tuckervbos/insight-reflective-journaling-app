import { useState } from "react";
import { updatePassword } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { GlowCard, GlowButton } from "../UIComponents";

const ChangePassword = ({ userId }) => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const [success, setSuccess] = useState(null);
	const navigate = useNavigate();

	const handlePasswordUpdate = async (e) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (newPassword !== confirmPassword) {
			setError("New passwords do not match.");
			return;
		}

		try {
			await updatePassword(userId, oldPassword, newPassword);
			setSuccess("Password updated successfully!");
			setOldPassword("");
			setNewPassword("");
			setConfirmPassword("");

			// Redirect to profile page after success
			setTimeout(() => navigate("/profile"), 1500);
		} catch (err) {
			setError("Error updating password. Please try again.");
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-black text-white">
			<GlowCard className="w-full max-w-lg p-6">
				<h2 className="text-violet-400 text-2xl font-semibold mb-4 text-center">
					Change Password
				</h2>
				<form onSubmit={handlePasswordUpdate} className="space-y-4">
					<div>
						<label className="block text-sm text-gray-400">
							Current Password
						</label>
						<input
							type="password"
							value={oldPassword}
							onChange={(e) => setOldPassword(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
							required
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-400">New Password</label>
						<input
							type="password"
							value={newPassword}
							onChange={(e) => setNewPassword(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
							required
						/>
					</div>
					<div>
						<label className="block text-sm text-gray-400">
							Confirm New Password
						</label>
						<input
							type="password"
							value={confirmPassword}
							onChange={(e) => setConfirmPassword(e.target.value)}
							className="w-full bg-black border border-violet-500 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-violet-600"
							required
						/>
					</div>
					{error && <p className="text-red-500 text-sm">{error}</p>}
					{success && <p className="text-green-500 text-sm">{success}</p>}
					<GlowButton type="submit" className="w-full">
						Update Password
					</GlowButton>
				</form>
			</GlowCard>
		</div>
	);
};

export default ChangePassword;

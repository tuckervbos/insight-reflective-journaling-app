import { useState, useEffect } from "react";
import useSessionStore from "../../store/sessionStore";
import useEntriesStore from "../../store/entriesStore";
import { useNavigate } from "react-router-dom";
import { GlowCard, GlowButton } from "../UIComponents";
import JournalCalendar from "../Calendar/JournalCalendar";

const UserProfile = () => {
	const { user, logout, deleteUser } = useSessionStore();
	const { entries, fetchEntries } = useEntriesStore();
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		fetchEntries();
	}, [fetchEntries]);

	if (!user) return <p>Loading...</p>;

	const handleDeleteAccount = async () => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete your account? This action cannot be undone."
		);
		if (!isConfirmed) return;

		setLoading(true);

		try {
			const result = await deleteUser(user.id);
			if (result.success) {
				await logout();
				navigate("/"); // Redirect to the landing page after deletion
			} else {
				alert("Failed to delete account. Please try again.");
			}
		} catch (error) {
			alert("An error occurred while deleting your account.");
		} finally {
			setLoading(false);
		}
	};

	const handleLogout = async () => {
		await logout();
		navigate("/");
	};

	return (
		<div className="min-h-screen flex flex-col items-center bg-black text-white px-8 py-12">
			<h1 className="text-5xl font-extralight text-violet-400 mb-6">
				User Profile
			</h1>

			<div className="grid grid-cols-12 gap-6 w-full max-w-7xl">
				{/* Left: Calendar */}
				<div className="col-span-5">
					<GlowCard className="p-4 w-full">
						<JournalCalendar />
					</GlowCard>
				</div>

				{/* Center: Profile Details */}
				<div className="col-span-4 flex flex-col space-y-6">
					<GlowCard className="p-6">
						<h2 className="text-violet-400 text-lg font-semibold mb-4">
							Profile Details
						</h2>
						<p>
							<strong>Username:</strong> {user.username}
						</p>
						<p>
							<strong>Email:</strong> {user.email}
						</p>
						<div className="mt-4 flex flex-col space-y-3">
							<GlowButton
								onClick={() => navigate("/profile/update")}
								className="px-4 py-2 text-sm w-full"
							>
								Update Profile
							</GlowButton>
							<GlowButton
								onClick={() => navigate("/profile/change-password")}
								className="px-4 py-2 text-sm w-full"
							>
								Change Password
							</GlowButton>
							<GlowButton
								onClick={handleLogout}
								className="px-4 py-2 text-sm w-full bg-red-600"
							>
								Logout
							</GlowButton>
							<GlowButton
								onClick={handleDeleteAccount}
								className="w-full bg-red-600"
								disabled={loading}
							>
								{loading ? "Deleting..." : "Delete Profile"}
							</GlowButton>
						</div>
					</GlowCard>
				</div>

				{/* Right: Recent Entries */}
				<div className="col-span-3">
					<GlowCard className="p-6">
						<h2 className="text-violet-400 text-lg font-semibold mb-4">
							Recent Entries
						</h2>
						{entries && entries.length > 0 ? (
							entries.slice(0, 5).map((entry) => (
								<div key={entry.id} className="border-b border-violet-500 p-2">
									<p className="text-gray-300">{entry.title}</p>
									<p
										className={`text-sm ${
											entry.sentiment?.toLowerCase() === "positive"
												? "text-green-400"
												: entry.sentiment?.toLowerCase() === "negative"
												? "text-red-400"
												: "text-gray-400"
										}`}
									>
										{entry.sentiment || "No Sentiment"}
									</p>
								</div>
							))
						) : (
							<p className="text-gray-500">No entries yet.</p>
						)}
					</GlowCard>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;

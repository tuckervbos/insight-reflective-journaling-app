import React, { useEffect, useState } from "react";
import { fetchUser, updateUser, deleteUser } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const UserProfile = ({ userId }) => {
	const [user, setUser] = useState(null);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		const getUser = async () => {
			try {
				const data = await fetchUser(userId);
				setUser(data);
				setUsername(data.username);
				setEmail(data.email);
				setLoading(false);
			} catch (err) {
				setError("Failed to load user data.");
				setLoading(false);
			}
		};
		getUser();
	}, [userId]);

	const handleUpdate = async () => {
		try {
			const updatedData = { username, email };
			await updateUser(userId, updatedData);
			alert("Profile updated successfully!");
		} catch (err) {
			setError("Error updating profile.");
		}
	};

	const handleDelete = async () => {
		if (
			!window.confirm(
				"Are you sure you want to delete your account? This action is irreversible!"
			)
		) {
			return;
		}
		try {
			await deleteUser(userId);
			alert("Account deleted. Redirecting to home...");
			navigate("/"); // Redirect user
		} catch (err) {
			setError("Error deleting account.");
		}
	};

	if (loading) return <p>Loading user data...</p>;
	if (error) return <p className="error">{error}</p>;

	return (
		<div className="user-profile">
			<h2>User Profile</h2>
			<label>
				Username:
				<input
					type="text"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
			</label>
			<label>
				Email:
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
				/>
			</label>
			<button onClick={handleUpdate}>Update Profile</button>
			<button onClick={() => navigate("/change-password")}>
				Change Password
			</button>
			<button onClick={handleDelete} className="delete-btn">
				Delete Account
			</button>
		</div>
	);
};

export default UserProfile;

import { useState } from "react";
import { updatePassword } from "../../utils/api";
import { useNavigate } from "react-router-dom";

const ChangePassword = ({ userId }) => {
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handlePasswordUpdate = async () => {
		if (newPassword !== confirmPassword) {
			setError("New passwords do not match.");
			return;
		}
		try {
			await updatePassword(userId, oldPassword, newPassword);
			alert("Password updated successfully!");
			navigate("/profile");
		} catch (err) {
			setError("Error updating password.");
		}
	};

	return (
		<div className="change-password">
			<h2>Change Password</h2>
			<label>
				Old Password:
				<input
					type="password"
					value={oldPassword}
					onChange={(e) => setOldPassword(e.target.value)}
				/>
			</label>
			<label>
				New Password:
				<input
					type="password"
					value={newPassword}
					onChange={(e) => setNewPassword(e.target.value)}
				/>
			</label>
			<label>
				Confirm New Password:
				<input
					type="password"
					value={confirmPassword}
					onChange={(e) => setConfirmPassword(e.target.value)}
				/>
			</label>
			{error && <p className="error">{error}</p>}
			<button onClick={handlePasswordUpdate}>Update Password</button>
		</div>
	);
};

export default ChangePassword;

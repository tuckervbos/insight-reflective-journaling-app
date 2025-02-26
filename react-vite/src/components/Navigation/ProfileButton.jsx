import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import useSessionStore from "../../store/sessionStore";
import { logout } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import "./ProfileButton.css";
import { GlowButton } from "../UIComponents";

function ProfileButton() {
	const { user, setUser } = useSessionStore();
	const [showMenu, setShowMenu] = useState(false);
	const ulRef = useRef();
	const navigate = useNavigate();
	const [errorMessage, setErrorMessage] = useState(null);

	const toggleMenu = (e) => {
		e.stopPropagation();
		setShowMenu((prev) => !prev);
	};

	useEffect(() => {
		if (!showMenu) return;

		const closeMenu = (e) => {
			if (ulRef.current && !ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		document.addEventListener("click", closeMenu);
		return () => document.removeEventListener("click", closeMenu);
	}, [showMenu]);

	const handleLogout = async () => {
		try {
			const errors = await logout(); // Call API to log out
			if (errors && errors.message) {
				setErrorMessage(errors.message || "Logout failed.");
				console.error("Logout API returned errors:", errors);
			} else {
				console.log("Logout successful");
				setUser(null); // Clear session store
				setShowMenu(false); // Close dropdown
				navigate("/"); // Redirect to landing page
			}
		} catch (error) {
			setErrorMessage("An unexpected error occurred.");
			console.error("Logout failed:", error);
		}
	};

	return (
		<>
			<GlowButton
				className="profile-icon"
				style={{ filter: "drop-shadow(0 0 8px rgba(255, 94, 77, 0.8))" }}
				onClick={toggleMenu}
			>
				<FaUserCircle />
			</GlowButton>
			{showMenu && (
				<ul className="profile-dropdown" ref={ulRef}>
					{user ? (
						<>
							<li className="dropdown-user-info">{user.username}</li>
							<li className="dropdown-user-info">{user.email}</li>
							<li>
								<GlowButton
									className="dropdown-item"
									onClick={() => {
										navigate("/home");
										setShowMenu(false);
									}}
								>
									Home
								</GlowButton>
							</li>
							<li>
								<GlowButton
									className="dropdown-item"
									onClick={() => {
										navigate("/profile");
										setShowMenu(false);
									}}
								>
									Profile
								</GlowButton>
							</li>
							<li>
								<GlowButton
									className="dropdown-item logout-btn"
									onClick={handleLogout}
								>
									Log out
								</GlowButton>
							</li>
						</>
					) : (
						<>
							<li>
								<GlowButton
									className="dropdown-item"
									onClick={() => {
										navigate("/login");
										setShowMenu(false);
									}}
								>
									Log in
								</GlowButton>
							</li>
							<li>
								<GlowButton
									className="dropdown-item"
									onClick={() => {
										navigate("/signup");
										setShowMenu(false);
									}}
								>
									Sign up
								</GlowButton>
							</li>
						</>
					)}
				</ul>
			)}
		</>
	);
}

export default ProfileButton;

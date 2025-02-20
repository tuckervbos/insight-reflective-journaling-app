import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import useSessionStore from "../../store/sessionStore";
import { logout } from "../../utils/api";
import { Link, useNavigate } from "react-router-dom";

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
			<button className="profile-icon" onClick={toggleMenu}>
				<FaUserCircle />
			</button>
			{showMenu && (
				<ul className="profile-dropdown" ref={ulRef}>
					{user ? (
						<>
							<li>{user.username}</li>
							<li>{user.email}</li>
							<li>
								<button onClick={handleLogout}>Log Out</button>
							</li>
						</>
					) : (
						<>
							<li>
								<Link to="/login" onClick={() => setShowMenu(false)}>
									Log In
								</Link>
							</li>
							<li>
								<Link to="/signup" onClick={() => setShowMenu(false)}>
									Sign Up
								</Link>
							</li>
						</>
					)}
				</ul>
			)}
		</>
	);
}

export default ProfileButton;

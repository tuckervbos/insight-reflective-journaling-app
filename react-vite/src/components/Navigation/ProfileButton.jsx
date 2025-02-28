import { useState, useEffect, useRef } from "react";
import { FaUserCircle } from "react-icons/fa";
import useSessionStore from "../../store/sessionStore";
import { logout } from "../../utils/api";
import { useNavigate } from "react-router-dom";
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
		const closeMenu = (e) => {
			if (ulRef.current && !ulRef.current.contains(e.target)) {
				setShowMenu(false);
			}
		};

		if (showMenu) {
			document.addEventListener("click", closeMenu);
		} else {
			document.removeEventListener("click", closeMenu);
		}

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
		<div className="relative">
			<GlowButton className="profile-icon" onClick={toggleMenu}>
				<FaUserCircle />
			</GlowButton>
			{showMenu && (
				<ul
					ref={ulRef}
					className="absolute top-full right-0 mt-2 w-auto bg-background border border-violet-500 rounded-md shadow-lg z-50 p-2"
				>
					{user ? (
						<>
							<li className="dropdown-user-info text-right pb-1 text-violet-300">
								hi, {user.username}
							</li>
							<li className="dropdown-user-info text-right pb-2 border-b-2 border-violet-500  text-violet-300">
								{user.email}
							</li>
							<li>
								<GlowButton
									className="w-full text-center mb-2 mt-2"
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
									className="w-full text-center mb-2"
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
									className="w-full text-center mb-2 text-red-500 hover:text-red-700"
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
									className="w-full text-left"
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
									className="w-full text-left"
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
		</div>
	);
}

export default ProfileButton;

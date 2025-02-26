import useSessionStore from "../../store/sessionStore";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import logo from "../../..//src/assets/logo-large-flat.png";
// import "./Navigation.css";
import { motion } from "motion/react";
import { GlowButton } from "../UIComponents";

function Navigation() {
	const user = useSessionStore((state) => state.user);
	const navigate = useNavigate();

	// const navLinks = user
	// 	? [
	// 			{ label: "Home", href: "/home" },
	// 			{ label: "Entries", href: "/entries" },
	// 	  ]
	// 	: [
	// 			{ label: "About", href: "/about" },
	// 			{ label: "Features", href: "/features" },
	// 	  ];

	const glowVariants = {
		initial: {
			scale: 1,
			filter: "drop-shadow(0 0 2px rgba(255, 94, 77, 0.5))", // 🔥 Orange-red glow
		},
		hover: {
			scale: 1.1,
			filter: "drop-shadow(0 0 8px rgba(255, 94, 77, 0.8))", // 🔥 Stronger glow effect
			transition: { duration: 0.3, ease: "easeInOut" },
		},
	};

	return (
		<nav className="bg-black border-b border-red-600 p-4 fixed top-0 left-0 w-full z-50">
			<div className="container mx-auto flex justify-between items-center">
				{/* ✅ Left - Glowing Logo */}
				<motion.div
					className="logo-container flex items-center cursor-pointer"
					onClick={() => navigate(user ? "/home" : "/")}
					variants={glowVariants}
					initial="initial"
					whileHover="hover"
				>
					<motion.img
						src={logo}
						alt="App Logo"
						className="logo"
						style={{ height: "50px", width: "auto" }}
					/>
				</motion.div>

				{/* ✅ Center - header */}
				<motion.div
					className="text-red-500 text-lg font-semibold cursor-pointer"
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2 }}
					onClick={() => navigate(user ? "/home" : "/")}
				>
					<h2>insight</h2>
				</motion.div>

				{/* ✅ Right - Profile Button / Auth Buttons */}
				<div className="flex items-center space-x-4">
					{user ? (
						<motion.div
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							<ProfileButton glowColor="rgba(255, 94, 77, 0.7)" />{" "}
							{/* Pass custom glow color */}
						</motion.div>
					) : (
						<>
							<GlowButton onClick={() => navigate("/login")}>Login</GlowButton>
							<GlowButton onClick={() => navigate("/signup")}>
								Sign Up
							</GlowButton>
						</>
					)}
				</div>
			</div>
		</nav>
	);
}

export default Navigation;

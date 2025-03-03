import useSessionStore from "../../store/sessionStore";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import logo from "../../..//src/assets/logo-large-flat.png";
import { motion } from "framer-motion";

function Navigation() {
	const user = useSessionStore((state) => state.user);
	const navigate = useNavigate();

	const glowVariants = {
		initial: {
			scale: 1,
			filter: "drop-shadow(0 0 2px rgba(138, 43, 226, 0.5))",
		},
		hover: {
			scale: 1.1,
			filter: "drop-shadow(0 0 8px rgba(138, 43, 226, 0.8))",
			transition: { duration: 0.3, ease: "easeInOut" },
		},
	};

	return (
		<nav className="bg-background text-white py-4 px-8 flex justify-between items-center border-b shadow-violet-500/50 border-violet-500">
			<div className="container mx-auto flex justify-between items-center">
				{/* ✅ Glowing Logo */}
				<motion.div
					className="cursor-pointer"
					onClick={() => navigate(user ? "/home" : "/")}
					variants={glowVariants}
					initial="initial"
					whileHover="hover"
				>
					<motion.img src={logo} alt="App Logo" className="h-12 w-auto" />
				</motion.div>

				{/* ✅ Center - App Title */}
				<motion.div
					className="text-violet-400 text-4xl font-light cursor-pointer"
					whileHover={{ scale: 1.05 }}
					transition={{ duration: 0.2 }}
					onClick={() => navigate(user ? "/home" : "/")}
				>
					<h2>insight</h2>
				</motion.div>

				{/* ✅ Right - Profile Dropdown */}
				<ProfileButton glowColor="rgba(138, 43, 226, 0.7)" />
			</div>
		</nav>
	);
}

export default Navigation;

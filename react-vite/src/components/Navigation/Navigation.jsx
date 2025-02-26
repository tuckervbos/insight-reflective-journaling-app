import useSessionStore from "../../store/sessionStore";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import logo from "../../..//src/assets/logo-large-flat.png";
import "./Navigation.css";
import { motion } from "motion/react";

function Navigation() {
	const user = useSessionStore((state) => state.user);
	const navigate = useNavigate();

	return (
		<motion.nav
			className="navbar"
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.5 }}
		>
			<motion.div
				className="logo-container"
				onClick={() => navigate(user ? "/home" : "/")}
				style={{ cursor: "pointer" }} // Change cursor on hover
			>
				<motion.img
					src={logo}
					alt="App Logo"
					className="logo"
					style={{ height: "50px", width: "auto" }} // Prevents stretching
					whileHover={{ scale: 1.1 }}
					transition={{ duration: 0.2 }}
				/>
			</motion.div>

			<motion.div
				className="nav-left"
				whileHover={{ scale: 1.05 }}
				transition={{ duration: 0.2 }}
				onClick={() => navigate(user ? "/home" : "/")}
			>
				<h2>insight</h2>
			</motion.div>

			<div className="nav-right">
				{user ? (
					<motion.div
						whileHover={{ scale: 1.05 }}
						transition={{ duration: 0.2 }}
					>
						<ProfileButton />
					</motion.div>
				) : (
					<>
						<motion.button
							onClick={() => navigate("/login")}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							Login
						</motion.button>
						<motion.button
							onClick={() => navigate("/signup")}
							whileHover={{ scale: 1.05 }}
							transition={{ duration: 0.2 }}
						>
							Sign Up
						</motion.button>
					</>
				)}
			</div>
		</motion.nav>
	);
}

export default Navigation;

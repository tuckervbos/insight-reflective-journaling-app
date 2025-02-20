import useSessionStore from "../../store/sessionStore";
import { useNavigate } from "react-router-dom";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";

function Navigation() {
	const user = useSessionStore((state) => state.user);
	const navigate = useNavigate();

	return (
		<nav className="navbar">
			<div className="nav-left">
				<h2 onClick={() => navigate(user ? "/home" : "/")}>insight</h2>
			</div>

			<div className="nav-right">
				{user ? (
					<>
						<ProfileButton />
					</>
				) : (
					<>
						<button onClick={() => navigate("/login")}>Login</button>
						<button onClick={() => navigate("/signup")}>Sign Up</button>
					</>
				)}
			</div>
		</nav>
	);
}

export default Navigation;

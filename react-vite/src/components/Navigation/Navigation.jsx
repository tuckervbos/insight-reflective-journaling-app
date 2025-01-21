import useSessionStore from "../../store/sessionStore";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/api";

function Navigation() {
	const { user, setUser } = useSessionStore();
	const navigate = useNavigate();

	const handleLogout = async () => {
		const errors = await logout();
		if (!errors) {
			setUser(null); // Clear user session in your store
			navigate("/login"); // Redirect to login page
		} else {
			console.error("Logout errors:", errors);
		}
	};

	return (
		<nav>
			{user ? (
				<>
					<span>Welcome, {user.username}</span>
					<button onClick={handleLogout}>Logout</button>
				</>
			) : (
				<button onClick={() => navigate("/login")}>Login</button>
			)}
		</nav>
	);
}

export default Navigation;

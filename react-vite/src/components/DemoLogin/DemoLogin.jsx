import { useNavigate } from "react-router-dom";
import useSessionStore from "../../store/sessionStore";
import { GlowButton } from "../UIComponents";

function DemoLogin() {
	const { setUser } = useSessionStore();
	const navigate = useNavigate();

	const handleDemoLogin = async () => {
		const response = await fetch("/api/auth/demo", { method: "POST" });
		const data = await response.json();

		if (response.ok) {
			setUser(data); // Store user session
			navigate("/home"); // Redirect to home
		}
	};

	return (
		<GlowButton className="w-full text-center mt-2" onClick={handleDemoLogin}>
			Demo User
		</GlowButton>
	);
}

export default DemoLogin;

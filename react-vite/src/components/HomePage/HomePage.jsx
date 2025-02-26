import useSessionStore from "../../store/sessionStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function HomePage() {
	const user = useSessionStore((state) => state.user);
	const authenticate = useSessionStore((state) => state.authenticate);
	const navigate = useNavigate();

	// Ensure user session is checked on mount
	useEffect(() => {
		authenticate();
	}, [authenticate]);

	// Redirect to landing page if user is not logged in
	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user, navigate]);

	// Loading state (optional, but useful if needed)
	if (user === undefined) {
		return <div>Loading...</div>;
	}

	return (
		<div className="homepage-container">
			<h1>Welcome to Your Journal</h1>
			<p>Start reflecting and tracking your progress.</p>
			<button onClick={() => navigate("/entries")}>View Your Entries</button>
			<div className="bg-red-500 text-white p-4">
				If this text is red, Tailwind is working!
			</div>
		</div>
	);
}

export default HomePage;

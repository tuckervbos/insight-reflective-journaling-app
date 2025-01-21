import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

function LandingPage() {
	const navigate = useNavigate();

	return (
		<div className="landing-page">
			<header className="landing-header">
				<h1>Welcome to Reflective Journaling</h1>
				<p>
					Make entries, set goals, and reach milestones. Track how weather
					impacts your mood and productivity over time. Get AI insights and
					feedback to grow.
				</p>
			</header>
			<div className="landing-actions">
				<button className="btn-primary" onClick={() => navigate("/signup")}>
					Get Started
				</button>
				<button className="btn-secondary" onClick={() => navigate("/login")}>
					Login
				</button>
			</div>
		</div>
	);
}

export default LandingPage;

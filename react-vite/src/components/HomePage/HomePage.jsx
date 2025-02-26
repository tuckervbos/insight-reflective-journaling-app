import useSessionStore from "../../store/sessionStore";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import { GlowButton, GlowCard, DarkThemeProvider } from "../UIComponents";
import { useAnimationFrame } from "motion/react";

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

	// Cube Animation
	const cubeRef = useRef(null);
	useAnimationFrame((t) => {
		if (!cubeRef.current) return;
		const rotate = Math.sin(t / 10000) * 200;
		const y = (1 + Math.sin(t / 1000)) * -50;
		cubeRef.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
	});

	return (
		<DarkThemeProvider>
			<div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
				<h1 className="text-4xl font-bold text-orange-400 mb-6">
					Welcome to Insight
				</h1>
				<p className="text-gray-400 mb-4">
					Reflect on your thoughts and track your progress.
				</p>

				{/* Weather & Moon Data */}
				<GlowCard className="w-full max-w-lg p-6 mb-6">
					<WeatherFetcher />
				</GlowCard>

				{/* Quick Actions */}
				<div className="flex space-x-4">
					<GlowButton onClick={() => navigate("/entries")}>
						View Entries
					</GlowButton>
					<GlowButton onClick={() => navigate("/entries/new")}>
						New Entry
					</GlowButton>
					<GlowButton onClick={() => navigate("/profile")}>Profile</GlowButton>
				</div>

				{/* Animated Cube */}
				<div className="fixed bottom-5 right-5">
					<div className="cube-container">
						<div className="cube" ref={cubeRef}>
							<div className="side front" />
							<div className="side left" />
							<div className="side right" />
							<div className="side top" />
							<div className="side bottom" />
							<div className="side back" />
						</div>
					</div>
				</div>
			</div>

			{/* Cube Styles */}
			<style>{`
		  .cube-container {
			perspective: 800px;
			width: 100px;
			height: 100px;
		  }
		  .cube {
			width: 100px;
			height: 100px;
			position: relative;
			transform-style: preserve-3d;
		  }
		  .side {
			position: absolute;
			width: 100%;
			height: 100%;
			opacity: 0.6;
			background: radial-gradient(circle, rgba(255,69,0,0.8) 0%, rgba(255,69,0,0.2) 100%);
		  }
		  .front { transform: rotateY(0deg) translateZ(50px); }
		  .right { transform: rotateY(90deg) translateZ(50px); }
		  .back { transform: rotateY(180deg) translateZ(50px); }
		  .left { transform: rotateY(-90deg) translateZ(50px); }
		  .top { transform: rotateX(90deg) translateZ(50px); }
		  .bottom { transform: rotateX(-90deg) translateZ(50px); }
		`}</style>
		</DarkThemeProvider>
	);
}

export default HomePage;

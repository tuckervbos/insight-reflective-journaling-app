import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GlowButton, GlowCard } from "../UIComponents";

const LandingPage = () => {
	const navigate = useNavigate();

	return (
		<div className="min-h-screen flex flex-col items-center justify-start pt-20 bg-background text-white px-6">
			{/* Hero Section */}
			<motion.div
				className="text-center max-w-3xl"
				initial={{ opacity: 0, y: 50 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
			>
				<h1 className="text-5xl font-extralight text-violet-400 mb-4">
					Welcome to Insight
				</h1>
				<p className="text-lg text-gray-300">
					A modern journaling experience with AI-powered insights, mood
					tracking, and seamless organization.
				</p>
			</motion.div>

			{/* Features Section */}

			<div className="mt-10 mb-10 max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-6">
				{[
					{
						title: "AI Sentiment Analysis",
						description:
							"Get insights into your emotions using AI-powered sentiment tracking.",
					},
					{
						title: "Beautiful Journal Entries",
						description:
							"Your thoughts, organized effortlessly with a clean and modern UI.",
					},
					{
						title: "Mood Trends & Calendar",
						description:
							"Track your moods over time and visualize patterns easily.",
					},
					{
						title: "Weather & Lunar Tracking",
						description:
							"Log your journal entries alongside daily weather conditions and lunar phases.",
					},
				].map((feature, index) => (
					<motion.div
						key={index}
						initial={{ opacity: 0, y: 50 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.5, delay: index * 0.2 }}
					>
						<GlowCard className="flex flex-col items-center p-6">
							<h3 className="text-xl font-semibold text-violet-400 mb-2">
								{feature.title}
							</h3>
							<p className="text-gray-400 text-center">{feature.description}</p>
						</GlowCard>
					</motion.div>
				))}
			</div>
			<div className="flex space-x-4 justify-center">
				<GlowButton onClick={() => navigate("/signup")} className="bg-black">
					Get Started
				</GlowButton>
				<GlowButton onClick={() => navigate("/login")} className="bg-black">
					Login
				</GlowButton>
			</div>
		</div>
	);
};

export default LandingPage;

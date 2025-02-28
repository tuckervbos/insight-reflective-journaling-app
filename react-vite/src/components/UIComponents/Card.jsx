import { motion } from "motion/react";

export const GlowCard = ({ children, className = "" }) => {
	const cardVariants = {
		initial: {
			boxShadow: "0 0 0 1px rgba(138, 43, 226, 0.3)", // Violet glow
		},
		animate: {
			boxShadow: [
				"0 0 0 1px rgba(138, 43, 226, 0.3), 0 0 0 0px rgba(138, 43, 226, 0.2)",
				"0 0 0 1px rgba(138, 43, 226, 0.5), 0 0 0 3px rgba(138, 43, 226, 0.3)",
				"0 0 0 1px rgba(138, 43, 226, 0.3), 0 0 0 0px rgba(138, 43, 226, 0.2)",
			],
			transition: {
				duration: 8,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	};

	return (
		<motion.div
			className="bg-background p-6 rounded-lg m-2 shadow-lg shadow-violet-500/50"
			variants={cardVariants}
			initial="initial"
			animate="animate"
		>
			{children}
		</motion.div>
	);
};

import { motion } from "framer-motion";

export const GlowCard = ({ children, className = "" }) => {
	// Infinity mirror animation for the card
	const cardVariants = {
		initial: {
			boxShadow: "0 0 0 1px rgba(255, 94, 77, 0.3)", // Red/Orange glow
		},
		animate: {
			boxShadow: [
				"0 0 0 1px rgba(255, 94, 77, 0.3), 0 0 0 0px rgba(255, 94, 77, 0.2), 0 0 0 0px rgba(255, 94, 77, 0.1)",
				"0 0 0 1px rgba(255, 94, 77, 0.5), 0 0 0 3px rgba(255, 94, 77, 0.3), 0 0 0 6px rgba(255, 94, 77, 0.1)",
				"0 0 0 1px rgba(255, 94, 77, 0.3), 0 0 0 0px rgba(255, 94, 77, 0.2), 0 0 0 0px rgba(255, 94, 77, 0.1)",
			],
			transition: {
				duration: 4,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	};

	return (
		<motion.div
			className={`bg-red-950 border border-red-700 p-6 rounded-lg ${className}`}
			variants={cardVariants}
			initial="initial"
			animate="animate"
		>
			{children}
		</motion.div>
	);
};

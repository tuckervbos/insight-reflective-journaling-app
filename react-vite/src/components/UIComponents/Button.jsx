import { motion } from "motion/react";

export const GlowButton = ({ children, onClick, className = "" }) => {
	const glowVariants = {
		initial: {
			boxShadow: "0 0 0 1px rgba(138, 43, 226, 1)", // Violet glow
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
		hover: {
			scale: 1.02, // Subtle scale effect
			boxShadow:
				"0 0 6px rgba(138, 43, 226, 0.7), 0 0 12px rgba(138, 43, 226, 0.4)", // Smoother shadow change
			transition: {
				duration: 0.1, // Slower transition to prevent "jumps"
				ease: "easeInOut",
			},
		},
	};

	return (
		<motion.button
			className={`relative bg-background text-violet-300 px-6 py-3 rounded-md font-medium transition duration-20 shadow-violet-500/50 ${className}`}
			variants={glowVariants}
			initial="initial"
			animate="animate"
			whileHover="hover"
			onClick={onClick}
		>
			{children}
		</motion.button>
	);
};

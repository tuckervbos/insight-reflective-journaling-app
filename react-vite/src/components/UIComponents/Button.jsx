import { motion } from "motion/react";

export const GlowButton = ({ children, onClick, className = "" }) => {
	const glowVariants = {
		initial: {
			boxShadow:
				"0 0 5px 0px rgba(255, 94, 77, 0.5), 0 0 10px 0px rgba(255, 94, 77, 0.3), 0 0 15px 0px rgba(255, 94, 77, 0.2)",
		},
		animate: {
			boxShadow: [
				"0 0 5px 0px rgba(255, 94, 77, 0.5), 0 0 10px 0px rgba(255, 94, 77, 0.3), 0 0 15px 0px rgba(255, 94, 77, 0.2)",
				"0 0 10px 2px rgba(255, 94, 77, 0.6), 0 0 20px 4px rgba(255, 94, 77, 0.4), 0 0 30px 6px rgba(255, 94, 77, 0.2)",
				"0 0 5px 0px rgba(255, 94, 77, 0.5), 0 0 10px 0px rgba(255, 94, 77, 0.3), 0 0 15px 0px rgba(255, 94, 77, 0.2)",
			],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
		hover: {
			scale: 1.05,
			boxShadow:
				"0 0 15px 3px rgba(255, 94, 77, 0.7), 0 0 30px 6px rgba(255, 94, 77, 0.5), 0 0 45px 9px rgba(255, 94, 77, 0.3)",
		},
	};

	return (
		<motion.button
			className={`relative text-orange-400 border border-orange-500 px-6 py-3 rounded-md font-medium transition-all duration-300 ease-in-out hover:bg-orange-900 hover:text-white ${className}`}
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

import { motion } from "motion/react";

export const GlowInput = ({ placeholder, value, onChange, className = "" }) => {
	// Infinity mirror animation for focus state
	const inputVariants = {
		initial: {
			boxShadow: "0 0 0 0px rgba(79, 209, 197, 0)",
		},
		focus: {
			boxShadow: [
				"0 0 0 1px rgba(79, 209, 197, 0.5), 0 0 0 0px rgba(79, 209, 197, 0.3), 0 0 0 0px rgba(79, 209, 197, 0.1)",
				"0 0 0 1px rgba(79, 209, 197, 0.5), 0 0 0 3px rgba(79, 209, 197, 0.3), 0 0 0 6px rgba(79, 209, 197, 0.1)",
				"0 0 0 1px rgba(79, 209, 197, 0.5), 0 0 0 0px rgba(79, 209, 197, 0.3), 0 0 0 0px rgba(79, 209, 197, 0.1)",
			],
			transition: {
				duration: 3,
				repeat: Infinity,
				ease: "easeInOut",
			},
		},
	};

	return (
		<motion.div className="relative">
			<motion.input
				type="text"
				className="bg-background  focus:ring-violet-500"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				variants={inputVariants}
				initial="initial"
				whileFocus="focus"
			/>
		</motion.div>
	);
};

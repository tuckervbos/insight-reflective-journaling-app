import { motion } from "motion/react";

export const GlowToggle = ({ isOn, onToggle, className = "" }) => {
	const toggleVariants = {
		on: {
			backgroundColor: "#065f46",
			boxShadow:
				"0 0 10px 2px rgba(79, 209, 197, 0.6), 0 0 20px 4px rgba(79, 209, 197, 0.4), 0 0 30px 6px rgba(79, 209, 197, 0.2)",
		},
		off: {
			backgroundColor: "#1f2937",
			boxShadow: "0 0 0 0px rgba(79, 209, 197, 0.1)",
		},
	};

	const springConfig = {
		type: "spring",
		stiffness: 500,
		damping: 30,
	};

	return (
		<motion.div
			className={`w-12 h-6 rounded-full p-1 cursor-pointer ${className}`}
			variants={toggleVariants}
			animate={isOn ? "on" : "off"}
			onClick={onToggle}
			transition={springConfig}
		>
			<motion.div
				className="bg-white w-4 h-4 rounded-full"
				animate={{
					x: isOn ? 24 : 0,
				}}
				transition={springConfig}
			/>
		</motion.div>
	);
};

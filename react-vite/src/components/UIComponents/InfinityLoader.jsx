import { motion } from "motion/react";

export const InfinityLoader = ({ className = "" }) => {
	const loaderVariants = {
		animate: {
			scale: [1, 1.2, 1],
			opacity: [0.5, 1, 0.5],
			boxShadow: [
				"0 0 5px 0px rgba(79, 209, 197, 0.5), 0 0 10px 0px rgba(79, 209, 197, 0.3), 0 0 15px 0px rgba(79, 209, 197, 0.1)",
				"0 0 10px 2px rgba(79, 209, 197, 0.7), 0 0 20px 4px rgba(79, 209, 197, 0.5), 0 0 30px 6px rgba(79, 209, 197, 0.3)",
				"0 0 5px 0px rgba(79, 209, 197, 0.5), 0 0 10px 0px rgba(79, 209, 197, 0.3), 0 0 15px 0px rgba(79, 209, 197, 0.1)",
			],
			transition: {
				duration: 1.5,
				repeat: Infinity,
				ease: "easeInOut",
				staggerChildren: 0.2,
			},
		},
	};

	const ringVariants = {
		animate: (index) => ({
			scale: [1, 1.1, 1],
			opacity: [0.3, 0.7, 0.3],
			boxShadow: [
				`0 0 ${5 * (3 - index)}px ${index}px rgba(79, 209, 197, 0.5)`,
				`0 0 ${10 * (3 - index)}px ${index * 2}px rgba(79, 209, 197, 0.7)`,
				`0 0 ${5 * (3 - index)}px ${index}px rgba(79, 209, 197, 0.5)`,
			],
			transition: {
				duration: 2,
				repeat: Infinity,
				ease: "easeInOut",
				delay: index * 0.3,
			},
		}),
	};

	return (
		<div
			className={`relative flex items-center justify-center w-16 h-16 ${className}`}
		>
			{[1, 2, 3].map((_, index) => (
				<motion.div
					key={index}
					className="absolute rounded-full border border-cyan-500"
					style={{
						width: `${100 - index * 20}%`,
						height: `${100 - index * 20}%`,
					}}
					custom={index + 1}
					variants={ringVariants}
					animate="animate"
				/>
			))}
			<motion.div
				className="w-4 h-4 bg-cyan-400 rounded-full"
				variants={loaderVariants}
				animate="animate"
			/>
		</div>
	);
};

import { motion } from "react/motion";
import { GlowButton } from "./Button";

export const GlowModal = ({ isOpen, onClose, title, children }) => {
	const backdropVariants = {
		hidden: { opacity: 0 },
		visible: { opacity: 1 },
	};

	const modalVariants = {
		hidden: {
			y: "-100vh",
			opacity: 0,
		},
		visible: {
			y: 0,
			opacity: 1,
			transition: {
				type: "spring",
				damping: 25,
				stiffness: 300,
			},
		},
		exit: {
			y: "100vh",
			opacity: 0,
		},
	};

	// Infinity mirror animation for the modal
	const glowVariants = {
		animate: {
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

	if (!isOpen) return null;

	return (
		<motion.div
			className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
			variants={backdropVariants}
			initial="hidden"
			animate="visible"
			exit="hidden"
		>
			<motion.div
				className="bg-gray-900 border border-cyan-700 rounded-lg w-full max-w-md mx-4"
				variants={modalVariants}
				initial="hidden"
				animate="visible"
				exit="exit"
				animate-variant={glowVariants.animate}
			>
				<div className="p-6">
					<div className="flex justify-between items-center mb-4">
						<h3 className="text-xl font-medium text-red-300">{title}</h3>
						<button
							onClick={onClose}
							className="text-gray-400 hover:text-white"
						>
							&times;
						</button>
					</div>
					<div className="mt-4">{children}</div>
					<div className="mt-6 flex justify-end">
						<GlowButton onClick={onClose}>Close</GlowButton>
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

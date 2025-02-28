import { motion } from "framer-motion";

export const GlowInput = ({ placeholder, value, onChange, className = "" }) => {
	return (
		<div className={`relative ${className}`}>
			<motion.div
				className="absolute inset-0 rounded-md bg-violet-500 opacity-50 blur-lg"
				initial={{ opacity: 0, scale: 1 }}
				animate={{ opacity: [0, 0.5, 0], scale: [1, 1.05, 1] }}
				transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.input
				type="text"
				className="relative z-10 w-full px-4 py-2 bg-black border border-violet-500 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
				placeholder={placeholder}
				value={value}
				onChange={onChange}
			/>
		</div>
	);
};

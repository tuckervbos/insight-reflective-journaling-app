export const fadeIn = {
	hidden: { opacity: 0 },
	visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const slideIn = {
	hidden: { x: -50, opacity: 0 },
	visible: { x: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } },
};

export const popIn = {
	hidden: { scale: 0.8, opacity: 0 },
	visible: {
		scale: 1,
		opacity: 1,
		transition: { duration: 0.4, ease: "easeOut" },
	},
};

export const staggerChildren = {
	visible: {
		transition: { staggerChildren: 0.2 },
	},
};

export const buttonHover = {
	whileHover: { scale: 1.1, transition: { duration: 0.2 } },
	whileTap: { scale: 0.9 },
};

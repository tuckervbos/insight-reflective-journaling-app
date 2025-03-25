import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";

export default function GradientCursorEffect() {
	const ref = useRef(null);
	const gradientX = useMotionValue(0.5);
	const gradientY = useMotionValue(0.5);

	const background = useTransform(() => {
		const x = gradientX.get() * 100;
		const y = gradientY.get() * 100;
		return `conic-gradient(from 0deg at ${x}% ${y}%, #0cdcf7, #ff0088, #fff312, #0cdcf7)`;
	});

	const handlePointerMove = (e) => {
		const rect = ref.current?.getBoundingClientRect();
		if (!rect) return;
		const x = (e.clientX - rect.left) / rect.width;
		const y = (e.clientY - rect.top) / rect.height;
		gradientX.set(x);
		gradientY.set(y);
	};

	useEffect(() => {
		const node = ref.current;
		if (!node) return;
		node.addEventListener("pointermove", handlePointerMove);
		return () => {
			node.removeEventListener("pointermove", handlePointerMove);
		};
	}, []);

	return (
		<div
			ref={ref}
			style={{
				width: "100%",
				height: "100%",
				borderRadius: "inherit",
				position: "absolute",
				inset: 0,
				overflow: "hidden",
			}}
		>
			<motion.div
				style={{
					background,
					position: "absolute",
					inset: 0,
					borderRadius: "inherit",
				}}
			/>
		</div>
	);
}

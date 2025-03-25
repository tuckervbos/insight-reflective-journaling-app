import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useRef, useEffect } from "react";

export default function GradientCursorEffect() {
	const ref = useRef(null);
	const gradientX = useMotionValue(0.5);
	const gradientY = useMotionValue(0.5);
	const hue = useMotionValue(0);

	useEffect(() => {
		const controls = animate(hue, [0, 360], {
			duration: 20,
			repeat: Infinity,
			repeatType: "loop",
			ease: "linear",
		});
		return () => controls.stop();
	}, [hue]);

	const background = useTransform(() => {
		const x = gradientX.get() * 100;
		const y = gradientY.get() * 100;
		const h = hue.get();

		return `conic-gradient(
            from 0deg at ${x}% ${y}%,
            hsl(${h}, 100%, 45%),
            hsl(${(h + 120) % 360}, 100%, 45%),
            hsl(${(h + 240) % 360}, 100%, 45%),
            hsl(${h}, 100%, 45%)
        )`;
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
		return () => node.removeEventListener("pointermove", handlePointerMove);
	}, []);

	return (
		<div
			ref={ref}
			style={{
				width: "100%",
				height: "100%",
				position: "absolute",
				inset: 0,
				borderRadius: "inherit",
				overflow: "hidden", // Keep it from leaking
				// pointerEvents: "none",
			}}
		>
			<motion.div
				style={{
					background,
					position: "absolute",
					inset: 0,
					borderRadius: "inherit",
					filter: "blur(4px)",
					opacity: 0.9,
					// pointerEvents: "none",
				}}
			/>
		</div>
	);
}

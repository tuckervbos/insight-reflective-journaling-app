import { useRef } from "react";
import { useAnimationFrame } from "motion/react";

const AnimatedCube = () => {
	const cubeRef = useRef(null);

	useAnimationFrame((t) => {
		if (!cubeRef.current) return;
		const rotate = Math.sin(t / 10000) * 200;
		const y = (1 + Math.sin(t / 1000)) * -5; // Smaller movement
		cubeRef.current.style.transform = `translateY(${y}px) rotateX(${rotate}deg) rotateY(${rotate}deg)`;
	});

	return (
		<div className="flex justify-center items-center">
			<div className="cube-container relative w-24 h-24">
				<div className="cube" ref={cubeRef}>
					<div className="side front" />
					<div className="side left" />
					<div className="side right" />
					<div className="side top" />
					<div className="side bottom" />
					<div className="side back" />
				</div>
			</div>
		</div>
	);
};

export default AnimatedCube;

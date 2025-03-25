import { useState } from "react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import GradientCursorEffect from "../UIComponents/GradientCursorEffect";
import useEntriesStore from "../../store/entriesStore";
import useGoalsStore from "../../store/goalsStore";
import useMilestonesStore from "../../store/milestonesStore";

export default function GlobalInsightButton() {
	const { entries } = useEntriesStore();
	const { goals } = useGoalsStore();
	const { milestones } = useMilestonesStore();
	const [loading, setLoading] = useState(false);

	const handleGlobalInsight = async () => {
		const granted = confirm(
			"Give AI access to analyze your journal and goals?"
		);
		if (!granted) return;

		setLoading(true);
		toast.loading("Analyzing your data...", { id: "analyzing" });
		try {
			const res = await fetch("/api/insights/analyze", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ entries, goals, milestones }),
			});
			const data = await res.json();
			toast.dismiss("analyzing");
			if (data.response) toast.success(data.response);
			else toast.error(data.error || "Something went wrong.");
		} catch (err) {
			toast.dismiss("analyzing");
			toast.error("Failed to fetch insight.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="relative w-full h-12 group">
			<motion.button
				onClick={handleGlobalInsight}
				type="button"
				whileHover={{ scale: 1.02 }}
				whileTap={{ scale: 0.98 }}
				disabled={loading}
				className="w-full h-full rounded border-2 border-violet-500 text-violet-300 text-2xl font-extralight z-10 relative overflow-hidden"
			>
				<span className="relative z-20">
					{loading ? "Thinking..." : "New Insight"}
				</span>
				<div className="absolute inset-0 z-0">
					<GradientCursorEffect />
				</div>
			</motion.button>
		</div>
	);
}

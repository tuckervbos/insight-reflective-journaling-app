import { useState } from "react";
import useInsightStore from "../../store/insightStore";
import { motion } from "framer-motion";
import GradientCursorEffect from "../UIComponents/GradientCursorEffect";

export default function InsightForm({ entryId = null }) {
	const { createInsight, loading, error } = useInsightStore();
	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const insight = await createInsight({ prompt, entry_id: entryId });

		if (insight?.response) setResponse(insight.response);

		if (!entryId && window.location.pathname.includes("/edit")) {
			console.log("Skipping save for edit insight page append.");
			return;
		}

		if (insight) setPrompt("");
		else console.warn("Insight creation was skipped or failed.");
	};

	return (
		<div className="insight-form-container space-y-2 bg-black text-white p-4 rounded-lg border border-violet-500 shadow-lg shadow-violet-500/50 mb-6">
			<h3 className="text-lg text-center text-violet-400 font-medium">
				Insight Assistant
			</h3>
			<form onSubmit={handleSubmit} className="space-y-2">
				<textarea
					placeholder="Ask me anything... What's on your mind?"
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					className="w-full p-2 rounded bg-background text-white border border-violet-500"
					required
				/>
				<div className="relative w-full h-12 group">
					<motion.button
						type="submit"
						whileHover={{ scale: 1.02 }}
						whileTap={{ scale: 0.98 }}
						disabled={loading}
						className="w-full h-full rounded border-2 border-violet-500 text-violet-300 text-2xl font-extralight z-10 relative overflow-hidden"
					>
						<span className="relative z-20">
							{loading ? "Thinking..." : "Ask Insight"}
						</span>
						<div className="absolute inset-0 z-0">
							<GradientCursorEffect />
						</div>
					</motion.button>
				</div>
			</form>

			{error && <p className="text-red-500">{error}</p>}
			{response && (
				<div className="bg-background p-3 rounded border border-gray-700">
					<strong>Response:</strong>
					<p>{response}</p>
				</div>
			)}
		</div>
	);
}

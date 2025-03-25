import { useState } from "react";
import useInsightStore from "../../store/insightStore";

export default function InsightForm({ entryId = null }) {
	const { createInsight, loading, error } = useInsightStore();
	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const insight = await createInsight({ prompt, entry_id: entryId });

		if (insight?.response) {
			setResponse(insight.response);
		}

		// Avoid saving if being used purely for appending in EditInsightPage
		if (!entryId && window.location.pathname.includes("/edit")) {
			console.log("Skipping save for edit insight page append.");
			return;
		}

		if (insight) {
			// setResponse(insight.response || "");
			setPrompt("");
		} else {
			console.warn("Insight creation was skipped or failed.");
		}
	};

	return (
		<div className="insight-form-container space-y-2 bg-black text-white p-4 rounded-lg border border-violet-500 shadow-lg shadow-violet-500/50 mb-6">
			<h3 className="text-lg text-center text-violet-400 font-medium">
				Insight Assistant
			</h3>
			<form onSubmit={handleSubmit} className="space-y-2">
				<textarea
					placeholder="Ask the assistant..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					className="w-full p-2 rounded bg-background text-white border border-violet-500"
					required
				/>
				<button
					type="submit"
					disabled={loading}
					className="px-4 py-2 bg-violet-600 rounded hover:bg-violet-700 disabled:opacity-50"
				>
					{loading ? "Thinking..." : "Ask"}
				</button>
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

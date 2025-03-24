import { useState } from "react";
import useAIStore from "../../store/aiStore";

export default function AIInteractionForm({ entryId = null }) {
	const { createInteraction, loading, error } = useAIStore();
	const [prompt, setPrompt] = useState("");
	const [response, setResponse] = useState("");

	const handleSubmit = async (e) => {
		e.preventDefault();

		const interaction = await createInteraction({ prompt, entry_id: entryId });
		if (interaction) {
			setResponse(interaction.response || "");
			setPrompt("");
		}
	};

	return (
		<div className="ai-form-container text-white space-y-2">
			<h3 className="text-lg font-medium">AI Assistant</h3>
			<form onSubmit={handleSubmit} className="space-y-2">
				<textarea
					placeholder="Ask the assistant..."
					value={prompt}
					onChange={(e) => setPrompt(e.target.value)}
					className="w-full p-2 rounded bg-gray-800 text-white border border-violet-500"
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
				<div className="bg-gray-900 p-3 rounded border border-gray-700">
					<strong>Response:</strong>
					<p>{response}</p>
				</div>
			)}
		</div>
	);
}

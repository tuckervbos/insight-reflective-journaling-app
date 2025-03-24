import { useEffect } from "react";
import useAIStore from "../../store/aiStore";

export default function AIInteractionList() {
	const { aiInteractions, loadAIInteractions, loading, error } = useAIStore();

	useEffect(() => {
		loadAIInteractions();
	}, [loadAIInteractions]);

	if (loading)
		return <p className="text-yellow-500">Loading past interactions...</p>;
	if (error) return <p className="text-red-500">Error loading: {error}</p>;
	if (!aiInteractions.length)
		return <p className="text-gray-400">No interactions yet.</p>;

	return (
		<div className="ai-interaction-list text-sm space-y-4">
			<h3 className="text-lg text-violet-400">Past AI Interactions</h3>
			<ul className="space-y-2">
				{aiInteractions.map(({ id, prompt, response }) => (
					<li
						key={id}
						className="bg-gray-800 p-3 rounded border border-gray-700"
					>
						<p>
							<strong>Prompt:</strong> {prompt}
						</p>
						<p>
							<strong>Response:</strong> {response}
						</p>
					</li>
				))}
			</ul>
		</div>
	);
}

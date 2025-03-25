import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useInsightStore from "../../store/insightStore";
import { GlowButton } from "../UIComponents";

export default function InsightList({
	limit,
	showControls = false,
	showViewButton = false,
}) {
	const { insights, loadInsights, loading, error, deleteInsight } =
		useInsightStore();
	const navigate = useNavigate();

	// useEffect(() => {
	// 	loadInsights();
	// }, [loadInsights]);

	const handleDelete = async (id) => {
		if (!window.confirm("Delete this insight?")) return;
		await deleteInsight(id);
	};

	if (loading)
		return <p className="text-yellow-500">Loading past insights...</p>;
	if (error) return <p className="text-red-500">Error loading: {error}</p>;
	if (!insights || insights.length === 0)
		return <p className="text-gray-400">No insights yet.</p>;

	const displayedInsights = limit
		? [...insights]
				.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
				.slice(0, limit)
		: [...insights].sort(
				(a, b) => new Date(b.created_at) - new Date(a.created_at)
		  );

	return (
		<div className="insight-list text-sm space-y-4 bg-black text-white p-4 rounded-lg border border-violet-500 shadow-lg shadow-violet-500/50">
			<h3 className="text-lg text-violet-400 font-semibold border-b border-violet-500 mb-6">
				{limit ? "Recent Insights" : "All Insights"}
			</h3>
			<ul className="space-y-2">
				{displayedInsights.map(({ id, prompt, response }) => (
					<li
						key={id}
						className="bg-background p-3 rounded border border-border"
					>
						<p>
							<strong>Prompt:</strong> {prompt}
						</p>
						<p>
							<strong>Response:</strong> {response}
						</p>

						{showControls ? (
							<div className="flex justify-end gap-2 mt-2">
								<GlowButton
									onClick={() => navigate(`/insights/${id}/edit`)}
									className="text-sm px-2 py-1"
								>
									Edit
								</GlowButton>
								<GlowButton
									onClick={() => handleDelete(id)}
									className="text-sm px-2 py-1 bg-red-600"
								>
									Delete
								</GlowButton>
							</div>
						) : showViewButton ? (
							<div className="flex justify-end mt-2">
								<GlowButton
									onClick={() => navigate(`/insights/${id}`)}
									className="text-sm px-2 py-1"
								>
									View
								</GlowButton>
							</div>
						) : null}
					</li>
				))}
			</ul>
		</div>
	);
}

import { useEffect } from "react";
import useInsightStore from "../../store/insightStore";
import { GlowCard } from "../UIComponents";
import InsightList from "../InsightList/InsightList";

const ViewInsightsPage = () => {
	const { insights, loadInsights, loading, error } = useInsightStore();

	// useEffect(() => {
	// 	loadInsights();
	// }, [loadInsights]);

	useEffect(() => {
		useInsightStore.getState().loadInsights();
	}, []);

	if (loading)
		return (
			<div className="text-yellow-500 text-center mt-8">
				Loading insights...
			</div>
		);
	if (error)
		return <div className="text-red-500 text-center mt-8">{error}</div>;
	if (!insights.length)
		return (
			<div className="text-gray-500 text-center mt-8">No insights yet.</div>
		);

	return (
		<div className="min-h-screen bg-black text-white px-4 py-8">
			<h1 className="text-4xl font-light text-center text-violet-400 mb-6">
				All Insights
			</h1>
			<div className="max-w-4xl mx-auto space-y-4">
				{/* {insights.map(({ id, prompt, response }) => (
					<GlowCard key={id} className="p-4 border border-violet-600">
						<p className="text-violet-300 font-semibold">Prompt:</p>
						<p className="mb-2 text-white">{prompt}</p>
						<p className="text-violet-300 font-semibold">Response:</p>
						<p className="text-gray-200">{response}</p>
					</GlowCard>
				))} */}
				<InsightList showControls={true} />
			</div>
		</div>
	);
};

export default ViewInsightsPage;

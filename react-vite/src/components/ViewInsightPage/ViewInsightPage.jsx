import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useInsightStore from "../../store/insightStore";
import { GlowCard, GlowButton } from "../UIComponents";

const ViewInsightPage = () => {
	const { insightId } = useParams();
	const navigate = useNavigate();
	const { currentInsight, loadInsight, loading, error } = useInsightStore();

	useEffect(() => {
		loadInsight(insightId);
	}, [insightId, loadInsight]);

	if (loading)
		return <div className="text-center mt-10 text-yellow-400">Loading...</div>;
	if (error)
		return <div className="text-center mt-10 text-red-500">{error}</div>;
	if (!currentInsight)
		return (
			<div className="text-center mt-10 text-red-500">Insight not found.</div>
		);

	return (
		<div className="min-h-screen px-6 py-10 bg-black text-white">
			<h1 className="text-3xl text-violet-400 font-light mb-6 text-center">
				Insight
			</h1>
			<div className="max-w-3xl mx-auto">
				<GlowCard className="p-6">
					<p className="text-violet-300 font-semibold mb-1">Prompt:</p>
					<p className="text-white mb-4">{currentInsight.prompt}</p>
					<p className="text-violet-300 font-semibold mb-1">Response:</p>
					<p className="text-gray-200 whitespace-pre-wrap">
						{currentInsight.response}
					</p>
					<div className="flex justify-end gap-3 mt-6">
						<GlowButton onClick={() => navigate(`/insights/${insightId}/edit`)}>
							Edit
						</GlowButton>
						<GlowButton
							className="bg-red-600"
							onClick={async () => {
								if (window.confirm("Delete this insight?")) {
									await useInsightStore.getState().deleteInsight(insightId);
									navigate("/insights");
								}
							}}
						>
							Delete
						</GlowButton>
					</div>
				</GlowCard>
			</div>
		</div>
	);
};

export default ViewInsightPage;

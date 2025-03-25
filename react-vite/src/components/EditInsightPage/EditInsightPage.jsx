import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useInsightStore from "../../store/insightStore";
import { GlowButton, GlowCard } from "../UIComponents";
import InsightForm from "../InsightForm/InsightForm";

const EditInsightPage = () => {
	const { insightId } = useParams();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ prompt: "", response: "" });
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				await useInsightStore.getState().loadInsight(insightId);
				const loaded = useInsightStore.getState().currentInsight;
				if (!loaded) throw new Error("Insight not found");
				setFormData({ prompt: loaded.prompt, response: loaded.response });
			} catch (err) {
				setError("Unable to load insight.");
			} finally {
				setLoading(false);
			}
		};
		fetchData();
	}, [insightId]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		await useInsightStore.getState().updateInsight(insightId, formData);
		navigate(`/insights/${insightId}`);
	};

	const handleAppendResponse = () => {
		const latestInsight = useInsightStore.getState().insights[0];
		if (latestInsight && latestInsight.response) {
			setFormData((prev) => ({
				...prev,
				response: `${prev.response}\n\n${latestInsight.response}`,
			}));
		}
	};

	if (loading)
		return <div className="text-center mt-10 text-yellow-400">Loading...</div>;
	if (error)
		return <div className="text-center mt-10 text-red-500">{error}</div>;

	return (
		<div className="min-h-screen px-6 py-10 bg-black text-white">
			<h1 className="text-3xl text-violet-400 font-light mb-6 text-center">
				Edit Insight
			</h1>
			<div className="max-w-3xl mx-auto">
				<GlowCard className="p-6">
					<div className="mt-3">
						<h2 className="text-xl font-semibold text-violet-400 mb-2">
							Need Help Refining Your Insight?
						</h2>
						<InsightForm entryId={null} />
					</div>
					<form onSubmit={handleSubmit} className="space-y-4">
						<div>
							<label className="block text-violet-300 font-semibold mb-1">
								Prompt
							</label>
							<textarea
								name="prompt"
								value={formData.prompt}
								onChange={handleChange}
								rows={4}
								className="w-full bg-black text-white p-2 rounded border border-violet-500 shadow-lg shadow-violet-500/50"
							/>
						</div>
						<div>
							<label className="block text-violet-300 font-semibold mb-1">
								Response
							</label>
							<textarea
								name="response"
								value={formData.response}
								onChange={handleChange}
								rows={6}
								className="w-full bg-black text-white p-2 mb-6 rounded border border-violet-500 shadow-lg shadow-violet-500/50"
							/>
						</div>
						<div className="flex justify-end">
							<GlowButton type="submit">Update Insight</GlowButton>
							<GlowButton
								type="button"
								onClick={handleAppendResponse}
								className="ml-2"
							>
								Append AI Response
							</GlowButton>
						</div>
					</form>
				</GlowCard>
			</div>
		</div>
	);
};

export default EditInsightPage;

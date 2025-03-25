import InsightForm from "../InsightForm/InsightForm";
import { GlowCard } from "../UIComponents";

export default function CreateInsightPage() {
	return (
		<div className="flex justify-center bg-black min-h-screen text-white p-8">
			<GlowCard className="max-w-2xl w-full">
				<h2 className="text-2xl text-violet-400 font-light mb-4">
					New Insight
				</h2>
				<InsightForm />
			</GlowCard>
		</div>
	);
}

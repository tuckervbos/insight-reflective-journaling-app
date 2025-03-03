import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEntriesStore from "../../store/entriesStore";
import { GlowButton } from "../UIComponents/Button";

const EntriesOverview = () => {
	const { entries, fetchEntries } = useEntriesStore();
	const navigate = useNavigate();

	useEffect(() => {
		fetchEntries();
	}, [fetchEntries]);

	return (
		<div className="p-4 bg-black rounded-lg shadow-violet-500/50 shadow-lg w-auto border border-violet-500 ">
			<h2 className="text-violet-400 text-lg font-semibold border-b-3 border-violet-500 mb-6">
				Recent Entries
			</h2>
			{entries && entries.length > 0 ? (
				entries.slice(0, 5).map((entry) => (
					<div
						key={entry.id}
						className="border-b border-violet-500  p-2 flex justify-between items-center"
					>
						<div>
							<p className="text-gray-300">{entry.title}</p>
							<p
								className={`text-sm ${
									entry.sentiment?.toLowerCase() === "positive"
										? "text-green-400"
										: entry.sentiment?.toLowerCase() === "negative"
										? "text-red-400"
										: "text-gray-400"
								}`}
							>
								{entry.sentiment || "No Sentiment"}
							</p>
						</div>
						<GlowButton
							onClick={() => navigate(`/entries/${entry.id}`)}
							className="text-violet-400"
						>
							View
						</GlowButton>
					</div>
				))
			) : (
				<p className="text-gray-500">No entries yet.</p>
			)}
		</div>
	);
};

export default EntriesOverview;

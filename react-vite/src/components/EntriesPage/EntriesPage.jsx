import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEntriesStore from "../../store/entriesStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";

const EntriesPage = () => {
	const { entries, fetchEntries } = useEntriesStore();
	const navigate = useNavigate();

	const sortedEntries = [...entries].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

	useEffect(() => {
		fetchEntries();
	}, [fetchEntries]);

	return (
		<div className="container mx-auto py-12 px-8">
			<h1 className="text-3xl font-semibold text-violet-300 mb-6">
				Your Journal Entries
			</h1>

			{/* ✅ Button to Create New Entry */}
			<GlowButton onClick={() => navigate("/entries/new")} className="mb-6">
				Add New Entry
			</GlowButton>

			{sortedEntries.length > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{sortedEntries.map((entry) => (
						<GlowCard key={entry.id} className="p-6">
							<h2 className="text-xl font-semibold text-violet-400 mb-2">
								{entry.title}
							</h2>
							<p className="text-gray-300 mb-4 truncate">{entry.body}</p>

							{/* ✅ Display AI Sentiment */}
							<p className="text-sm text-gray-400 italic mb-4">
								Sentiment:{" "}
								<span
									className={`${
										entry.sentiment === "Positive"
											? "text-green-400"
											: entry.sentiment === "Negative"
											? "text-red-400"
											: "text-gray-400"
									}`}
								>
									{entry.sentiment || "Unknown"}
								</span>
							</p>

							{/* ✅ Buttons for navigation */}
							<div className="flex justify-between">
								<GlowButton onClick={() => navigate(`/entries/${entry.id}`)}>
									View
								</GlowButton>

								<GlowButton
									onClick={() => navigate(`/entries/${entry.id}/edit`)}
									className="bg-violet-600"
								>
									Edit
								</GlowButton>
							</div>
						</GlowCard>
					))}
				</div>
			) : (
				<p className="text-gray-400">No entries found.</p>
			)}
		</div>
	);
};

export default EntriesPage;

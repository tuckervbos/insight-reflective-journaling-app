import { useParams, useNavigate } from "react-router-dom";
import useEntriesStore from "../../store/entriesStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";

// Page transition animation
const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const ViewEntryPage = () => {
	const { entryId } = useParams();
	const navigate = useNavigate();
	const { entries, deleteEntry } = useEntriesStore();

	const entry = entries.find((e) => e.id === parseInt(entryId));

	if (!entry) {
		return (
			<div className="container mx-auto py-12 px-6">
				<GlowCard className="p-6 text-center">
					<h1 className="text-3xl font-semibold text-violet-300 mb-4">
						Entry Not Found
					</h1>
					<GlowButton onClick={() => navigate("/entries")}>
						Back to Entries
					</GlowButton>
				</GlowCard>
			</div>
		);
	}

	const handleDelete = async () => {
		const confirmed = window.confirm(
			"Are you sure you want to delete this entry?"
		);
		if (!confirmed) return;

		await deleteEntry(entryId);
		navigate("/entries"); // Redirect back to entries after deletion
	};

	return (
		<motion.div
			className="container mx-auto py-12 px-6"
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<div className="container mx-auto py-12 px-6">
				<GlowCard className="p-6">
					<h1 className="text-3xl font-semibold text-violet-300 mb-4">
						{entry.title}
					</h1>
					<p className="text-gray-300 mb-6">{entry.body}</p>

					<div className="text-gray-400">
						<p>
							<strong>Weather:</strong> {entry.weather || "N/A"}
						</p>
						<p>
							<strong>Moon Phase:</strong> {entry.moon_phase || "N/A"}
						</p>
						<p>
							<strong>AI Sentiment:</strong>{" "}
							<span
								className={`${
									entry.sentiment?.toLowerCase() === "positive"
										? "text-green-400"
										: entry.sentiment?.toLowerCase() === "negative"
										? "text-red-400"
										: "text-gray-400"
								}`}
							>
								{entry.sentiment || "Unknown"}
							</span>
						</p>
					</div>

					<div className="mt-6 flex justify-between">
						<GlowButton onClick={() => navigate("/entries")}>
							Back to Entries
						</GlowButton>
						<div className="flex space-x-4">
							<GlowButton onClick={() => navigate(`/entries/${entryId}/edit`)}>
								Edit Entry
							</GlowButton>
							<GlowButton
								onClick={handleDelete}
								className="bg-red-600 hover:bg-red-700"
							>
								Delete Entry
							</GlowButton>
						</div>
					</div>
				</GlowCard>
			</div>
		</motion.div>
	);
};

export default ViewEntryPage;

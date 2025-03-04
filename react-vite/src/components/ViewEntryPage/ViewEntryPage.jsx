import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchEntryById } from "../../utils/api";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";
import useGoalsStore from "../../store/goalsStore";
import useEntriesStore from "../../store/entriesStore";

// Page transition animation
const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const statusMapping = {
	in_progress: "In Progress",
	completed: "Completed",
	on_hold: "On Hold",
	cancelled: "Cancelled",
};

const ViewEntryPage = () => {
	const { entryId } = useParams();
	const navigate = useNavigate();
	const [entry, setEntry] = useState(null);
	const [error, setError] = useState(null);

	const { fetchGoalsForEntry, associatedGoals, clearAssociatedGoals } =
		useEntriesStore();

	const { deleteEntry } = useEntriesStore();

	useEffect(() => {
		const loadEntry = async () => {
			try {
				const fetchedEntry = await fetchEntryById(entryId);
				setEntry(fetchedEntry);

				// Fetch goals associated with the entry
				if (entryId) {
					clearAssociatedGoals();
					await fetchGoalsForEntry(entryId);
				}
			} catch (err) {
				setError("Entry not found.");
			}
		};

		if (entryId) {
			loadEntry();
		}
	}, [entryId, fetchGoalsForEntry, clearAssociatedGoals]);

	if (error) {
		return (
			<div className="container mx-auto py-12 px-6">
				<GlowCard className="p-6 text-center">
					<h1 className="text-3xl font-semibold text-violet-300 mb-4">
						{error}
					</h1>
					<GlowButton onClick={() => navigate("/entries")}>
						Back to Entries
					</GlowButton>
				</GlowCard>
			</div>
		);
	}

	if (!entry) {
		return <p className="text-center text-gray-400">Loading entry...</p>;
	}

	return (
		<motion.div
			className="container mx-auto py-12 px-6"
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<GlowCard className="p-6">
				<h1 className="text-3xl font-semibold text-violet-300 mb-4">
					{entry.title}
				</h1>
				<p className="text-gray-300 mb-6">{entry.body}</p>

				<div className="text-gray-400 mb-6">
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

				{/* Display associated goals */}
				<div className="text-gray-400 mb-6">
					<h2 className="text-2xl font-semibold text-violet-300 mb-4">
						Associated Goals:
					</h2>
					{associatedGoals.length === 0 ? (
						<p className="text-gray-500">
							No goals associated with this entry.
						</p>
					) : (
						<ul className="space-y-2">
							{associatedGoals.map((goal) => (
								<GlowCard key={goal.id} className="bg-deepDark rounded-md flex">
									<div className="flex-grow">
										<h3 className="text-white font-semibold">{goal.title}</h3>
										<p className="text-gray-400">{goal.description}</p>
										<span
											className={`text-sm ${
												goal.status === "completed"
													? "text-green-400"
													: goal.status === "in_progress"
													? "text-yellow-400"
													: goal.status === "on_hold"
													? "text-orange-400"
													: "text-red-500"
											}`}
										>
											Status: {statusMapping[goal.status] || "Unknown"}
										</span>
									</div>

									<div className="ml-auto mt-5">
										<GlowButton onClick={() => navigate(`/goals/${goal.id}`)}>
											View Goal
										</GlowButton>
									</div>
								</GlowCard>
							))}
						</ul>
					)}
				</div>

				<div className="mt-6 flex justify-between">
					<div className="flex space-x-4">
						<GlowButton onClick={() => navigate("/entries")}>
							Back to Entries
						</GlowButton>
						<GlowButton onClick={() => navigate("/home")}>
							Back to Home
						</GlowButton>
					</div>
					<div className="flex space-x-4">
						<GlowButton
							onClick={() => {
								if (entryId) {
									navigate(`/entries/${entryId}/edit`);
								}
							}}
						>
							Edit Entry
						</GlowButton>
						<GlowButton
							onClick={async () => {
								const isConfirmed = window.confirm(
									"Are you sure you want to delete this entry?"
								);
								if (isConfirmed) {
									await deleteEntry(entryId);
									navigate("/entries");
								}
							}}
							className="bg-red-500"
						>
							Delete Entry
						</GlowButton>
					</div>
				</div>
			</GlowCard>
		</motion.div>
	);
};

export default ViewEntryPage;

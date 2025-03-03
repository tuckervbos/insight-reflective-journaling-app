import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGoalsStore from "../../store/goalsStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";

const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

// Status mapping to convert status codes to user-friendly text
const statusMapping = {
	in_progress: "In Progress",
	completed: "Completed",
	on_hold: "On Hold",
	cancelled: "Cancelled",
};

const ViewGoalPage = () => {
	const { goalId } = useParams();
	const navigate = useNavigate();
	const {
		fetchGoalById,
		deleteGoal,
		clearGoals,
		fetchEntriesForGoal,
		associatedEntries,
		fetchGoals,
	} = useGoalsStore();

	const [goal, setGoal] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadGoal = async () => {
			try {
				console.log("Clearing existing goals...");
				clearGoals();

				console.log(`Fetching goal with ID: ${goalId}`);
				const fetchedGoal = await fetchGoalById(goalId);

				if (fetchedGoal) {
					setGoal(fetchedGoal);

					console.log(`Fetching entries associated with goal ID: ${goalId}`);
					await fetchEntriesForGoal(goalId);
				} else {
					setError("Goal not found.");
				}
			} catch (err) {
				console.error("Error fetching goal:", err);
				setError("Goal not found.");
			} finally {
				setLoading(false);
			}
		};

		if (goalId) {
			loadGoal();
		} else {
			setError("Goal not found.");
			setLoading(false);
		}
	}, [goalId, fetchGoalById, clearGoals, fetchEntriesForGoal]);

	if (loading) {
		return <p className="text-center text-gray-400">Loading goal...</p>;
	}

	if (error) {
		return (
			<motion.div
				className="container mx-auto py-12 px-6"
				variants={pageVariants}
				initial="initial"
				animate="animate"
				exit="exit"
			>
				<GlowCard className="p-6 text-center">
					<h1 className="text-3xl font-semibold text-violet-300 mb-4">
						{error}
					</h1>
					<GlowButton onClick={() => navigate("/goals")}>
						Back to Goals
					</GlowButton>
				</GlowCard>
			</motion.div>
		);
	}

	const handleDeleteGoal = async () => {
		const isConfirmed = window.confirm(
			"Are you sure you want to delete this goal?"
		);
		if (isConfirmed) {
			try {
				console.log("Deleting goal with ID:", goal.id);
				await deleteGoal(goal.id);
				await fetchGoals(); // Correctly fetch the updated goals list
				navigate("/goals");
			} catch (error) {
				console.error("Failed to delete goal:", error);
			}
		}
	};

	return (
		<motion.div
			className="container mx-auto py-12 px-6"
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<GlowCard className="p-6">
				{goal ? (
					<>
						<h1 className="text-3xl font-semibold text-violet-300 mb-4">
							{goal.title}
						</h1>
						<p className="text-gray-300 mb-6">{goal.description}</p>
						<p className="text-gray-400">
							<strong>Status:</strong>{" "}
							<span
								className={`${
									goal.status === "completed"
										? "text-green-400"
										: goal.status === "in_progress"
										? "text-yellow-400"
										: goal.status === "on_hold"
										? "text-orange-400"
										: "text-red-500"
								}`}
							>
								{statusMapping[goal.status] || "Unknown"}
							</span>
						</p>

						{/* Associated Entries Section */}
						<div className="mt-8">
							<h2 className="text-2xl font-semibold text-violet-300 mb-4">
								Associated Entries
							</h2>
							{associatedEntries.length === 0 ? (
								<p className="text-gray-500">
									No entries associated with this goal.
								</p>
							) : (
								<ul className="space-y-2">
									{associatedEntries.map((entry) => (
										<li
											key={entry.id}
											className="p-4 bg-deepDark border border-border rounded-md"
										>
											<h3 className="text-white font-semibold">
												{entry.title}
											</h3>
											<p className="text-gray-400">{entry.body}</p>
											<GlowButton
												onClick={() => navigate(`/entries/${entry.id}`)}
												className="mt-2"
											>
												View Entry
											</GlowButton>
										</li>
									))}
								</ul>
							)}
						</div>

						<div className="mt-6 flex justify-between">
							<GlowButton onClick={() => navigate("/goals")}>
								Back to Goals
							</GlowButton>
							<GlowButton onClick={() => navigate(`/goals/${goalId}/edit`)}>
								Edit Goal
							</GlowButton>
							<GlowButton onClick={handleDeleteGoal} className="bg-red-500">
								Delete
							</GlowButton>
						</div>
					</>
				) : (
					<p className="text-center text-gray-400">Loading goal...</p>
				)}
			</GlowCard>
		</motion.div>
	);
};

export default ViewGoalPage;

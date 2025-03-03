import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useGoalsStore from "../../store/goalsStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";

// Page transition animation
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

const GoalsPage = () => {
	const navigate = useNavigate();
	const { fetchGoals, goals, deleteGoal, clearGoals } = useGoalsStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadGoals = async () => {
			await fetchGoals();
			setLoading(false);
		};
		clearGoals(); // Avoid showing stale data
		loadGoals();
	}, [fetchGoals, clearGoals]);

	if (loading) {
		return <p className="text-center text-gray-400">Loading goals...</p>;
	}

	const sortedGoals = [...goals].sort(
		(a, b) => new Date(b.created_at) - new Date(a.created_at)
	);

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
					Your Goals
				</h1>
				{sortedGoals.length === 0 ? (
					<p className="text-gray-500">
						No goals found. Start setting new goals!
					</p>
				) : (
					<ul className="space-y-4">
						{sortedGoals.map((goal) => (
							<GlowCard
								key={goal.id}
								className="p-4 bg-deepDark rounded-md border border-border flex justify-between items-center"
							>
								<div className="flex-grow">
									<h2 className="text-xl text-white font-semibold">
										{goal.title}
									</h2>
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

								<div className="flex space-x-4">
									<GlowButton
										onClick={() => navigate(`/goals/${goal.id}`)}
										className="mt-2"
									>
										View Goal
									</GlowButton>
									<GlowButton
										onClick={() => navigate(`/goals/${goal.id}/edit`)}
										className="mt-2"
									>
										Edit
									</GlowButton>
									<GlowButton
										onClick={async () => {
											const isConfirmed = window.confirm(
												"Are you sure you want to delete this goal?"
											);
											if (isConfirmed) {
												await deleteGoal(goal.id);
												await fetchGoals(); // Refresh goals after deletion
											}
										}}
										className="mt-2 bg-red-500"
									>
										Delete
									</GlowButton>
								</div>
							</GlowCard>
						))}
					</ul>
				)}

				<div className="mt-6 flex justify-end">
					<GlowButton onClick={() => navigate("/goals/new")}>
						Add New Goal
					</GlowButton>
				</div>
			</GlowCard>
		</motion.div>
	);
};

export default GoalsPage;

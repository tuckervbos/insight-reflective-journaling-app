import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGoalsStore from "../../store/goalsStore";
import { GlowCard } from "../UIComponents/Card";
import { GlowButton } from "../UIComponents/Button";

const statusMapping = {
	in_progress: "In Progress",
	completed: "Completed",
	on_hold: "On Hold",
	cancelled: "Cancelled",
};

// Status-based color classes
const statusColors = {
	in_progress: "text-yellow-400",
	on_hold: "text-orange-400",
	completed: "text-green-400",
	cancelled: "text-red-500",
};

const GoalsOverview = () => {
	const { fetchGoals, goals } = useGoalsStore();
	const navigate = useNavigate();

	useEffect(() => {
		fetchGoals();
	}, [fetchGoals]);

	// Filter and sort goals by status
	const inProgressGoals = goals.filter((goal) => goal.status === "in_progress");
	const onHoldGoals = goals.filter((goal) => goal.status === "on_hold");
	const completedGoals = goals
		.filter((goal) => goal.status === "completed")
		.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

	return (
		<div className="bg-black p-4 rounded-lg shadow-violet-500/50 shadow-lg w-auto border border-violet-500">
			<h2 className="text-violet-400 text-lg font-semibold mb-6 border-b-3 border-violet-500">
				Goals Overview
			</h2>

			{/* In Progress Goals */}
			{inProgressGoals.length > 0 && (
				<div className="mb-6">
					<h3 className="text-yellow-400 font-semibold mb-1">In Progress</h3>

					{inProgressGoals.map((goal) => (
						<li
							key={goal.id}
							className="border-b border-violet-500 p-2 flex justify-between items-center"
						>
							<span>{goal.title}</span>
							<GlowButton
								onClick={() => navigate(`/goals/${goal.id}`)}
								className="text-violet-400"
							>
								View
							</GlowButton>
						</li>
					))}
				</div>
			)}

			{/* On Hold Goals */}
			{onHoldGoals.length > 0 && (
				<div className="mb-6">
					<h3 className="text-orange-400 font-semibold mb-2">On Hold</h3>

					{onHoldGoals.map((goal) => (
						<li
							key={goal.id}
							className="border-b border-violet-500 p-2 flex justify-between items-center"
						>
							<span>{goal.title}</span>
							<GlowButton
								onClick={() => navigate(`/goals/${goal.id}`)}
								className="text-violet-400"
							>
								View
							</GlowButton>
						</li>
					))}
				</div>
			)}

			{/* Completed Goals */}
			{completedGoals.length > 0 && (
				<div>
					<h3 className="text-green-400 font-semibold mb-2">Completed Goals</h3>

					{completedGoals.map((goal) => (
						<li
							key={goal.id}
							className="border-b border-violet-500 p-2 flex justify-between items-center"
						>
							<span>{goal.title}</span>
							<GlowButton
								onClick={() => navigate(`/goals/${goal.id}`)}
								className="bg-black text-white"
							>
								View
							</GlowButton>
						</li>
					))}
				</div>
			)}

			{/* If no goals to show */}
			{inProgressGoals.length === 0 &&
				onHoldGoals.length === 0 &&
				completedGoals.length === 0 && (
					<p className="text-gray-500">No goals to display.</p>
				)}
		</div>
	);
};

export default GoalsOverview;

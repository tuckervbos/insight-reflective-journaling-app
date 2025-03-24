import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useGoalsStore from "../../store/goalsStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";
import { createMilestone } from "../../utils/api";
import useMilestonesStore from "../../store/milestonesStore";

const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const EditGoalPage = () => {
	const { goalId } = useParams();
	const navigate = useNavigate();
	const {
		fetchGoalById,
		updateGoal,
		clearGoals,
		fetchEntriesForGoal,
		associatedEntries,
	} = useGoalsStore();
	const { fetchMilestones, milestones } = useMilestonesStore();

	const [goal, setGoal] = useState(null);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("in_progress");
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [initialStatus, setInitialStatus] = useState(null);

	useEffect(() => {
		const loadGoal = async () => {
			try {
				clearGoals();
				const fetchedGoal = await fetchGoalById(goalId);

				if (fetchedGoal) {
					setGoal(fetchedGoal);
					setTitle(fetchedGoal.title);
					setDescription(fetchedGoal.description);
					setStatus(fetchedGoal.status);
					setInitialStatus(fetchedGoal.status);
					await fetchEntriesForGoal(goalId);
				} else {
					setError("Goal not found.");
				}
			} catch (err) {
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

	const handleUpdate = async (e) => {
		e.preventDefault();

		if (!title.trim()) return alert("Title is required.");
		if (!description.trim()) return alert("Description is required.");

		const statusChangedToCompleted =
			initialStatus !== "completed" && status === "completed";

		let userConfirmed = false;
		if (statusChangedToCompleted) {
			userConfirmed = window.confirm(
				"This goal is now marked as completed. Would you like to create a milestone from it?"
			);
		}

		try {
			await updateGoal(goalId, { title, description, status });

			// 🔁 Wait for server-side goal update to reflect
			let updatedGoal = null;
			let retries = 5;
			while (retries--) {
				await new Promise((res) => setTimeout(res, 300));
				updatedGoal = await fetchGoalById(goalId);
				if (updatedGoal?.status === "completed") break;
			}

			if (userConfirmed && updatedGoal?.status === "completed") {
				try {
					await createMilestone({
						milestone_name: title,
						goal_id: parseInt(goalId),
						is_completed: true,
					});
				} catch (milestoneError) {
					console.error("Failed to create milestone:", milestoneError);
					alert("Goal updated, but failed to create milestone.");
				}
			}

			navigate(`/goals/${goalId}`);
		} catch (err) {
			console.error("❌ Error updating goal or creating milestone:", err);
			setError("Failed to update goal.");
		}
	};

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

	return (
		<motion.div
			className="container mx-auto py-12 px-6"
			variants={pageVariants}
			initial="initial"
			animate="animate"
			exit="exit"
		>
			<GlowCard className="p-6">
				<h1 className="text-3xl font-semibold text-violet-300 mb-6">
					Edit Goal
				</h1>
				<form onSubmit={handleUpdate} className="space-y-6">
					<div>
						<label className="block text-gray-300 mb-1">Title</label>
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="w-full p-2 bg-deepDark border border-border rounded-md"
							placeholder="Enter goal title"
							required
						/>
					</div>
					<div>
						<label className="block text-gray-300 mb-1">Description</label>
						<textarea
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full p-2 bg-deepDark border border-border rounded-md"
							placeholder="Enter goal description"
							rows="4"
						/>
					</div>
					<div>
						<label className="block text-gray-300 mb-1">Status</label>
						<select
							value={status}
							onChange={(e) => setStatus(e.target.value)}
							className="w-full p-2 bg-deepDark border border-border rounded-md"
						>
							<option value="in_progress">In Progress</option>
							<option value="completed">Completed</option>
							<option value="on_hold">On Hold</option>
							<option value="cancelled">Cancelled</option>
						</select>
					</div>

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
										<h3 className="text-white font-semibold">{entry.title}</h3>
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

					{/* Associated Milestones Section */}
					<div className="mt-8">
						<h2 className="text-2xl font-semibold text-violet-300 mb-4">
							Associated Milestones
						</h2>
						{milestones?.filter((m) => m.goal_id === parseInt(goalId))
							.length === 0 ? (
							<p className="text-gray-500">
								No milestones associated with this goal.
							</p>
						) : (
							<ul className="space-y-2">
								{milestones
									.filter((m) => m.goal_id === parseInt(goalId))
									.map((milestone) => (
										<li
											key={milestone.id}
											className="p-4 bg-deepDark border border-border rounded-md"
										>
											<h3 className="text-white font-semibold">
												{milestone.milestone_name}
											</h3>
											<p className="text-gray-400">
												{milestone.is_completed ? "Completed" : "Pending"}
											</p>
										</li>
									))}
							</ul>
						)}
					</div>

					<div className="flex space-x-4 mt-6">
						<GlowButton type="submit">Update Goal</GlowButton>
						<GlowButton
							type="button"
							className="bg-red-500"
							onClick={() => navigate(`/goals/${goalId}`)}
						>
							Cancel
						</GlowButton>
					</div>
				</form>
			</GlowCard>
		</motion.div>
	);
};

export default EditGoalPage;

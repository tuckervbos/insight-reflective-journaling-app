import { useState, useEffect } from "react";
import useGoalsStore from "../../store/goalsStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowInput } from "../UIComponents/Input";

const GoalSetter = ({ entryId, navigate }) => {
	const { createGoal, fetchGoalsForEntry, goals, clearGoals } = useGoalsStore();
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("in_progress");
	const [showGoalForm, setShowGoalForm] = useState(false);

	useEffect(() => {
		// Clear goals when component is mounted and unmounted
		clearGoals();
		return () => clearGoals();
	}, [clearGoals]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!entryId) {
			console.error("Entry ID is not defined.");
			return;
		}

		try {
			const newGoal = await createGoal({
				title,
				description,
				status,
				entry_id: entryId,
			});

			console.log("Creating goal for entry ID:", entryId);

			// Fetch goals for the specific entry
			await fetchGoalsForEntry(entryId);

			setTitle("");
			setDescription("");
			setStatus("in_progress");
			setShowGoalForm(false);

			if (newGoal && newGoal.id) {
				console.log(
					"Goal created successfully, navigating to view entry page..."
				);
				clearGoals();
				navigate(true);
			}
		} catch (error) {
			console.error("Error creating goal or linking to entry:", error);
		}
	};

	const handleSkipGoalSetting = () => {
		if (entryId) {
			console.log("Skipping goal setting, navigating to view entry page...");
			clearGoals();
			navigate(false); // Navigate without setting a goal
		}
	};

	return (
		<div className="p-4 bg-deepDark rounded-md border border-border glow-card">
			<h2 className="text-xl text-violet-500 font-semibold mb-2">
				Set Goals for this Entry
			</h2>

			{!showGoalForm ? (
				<GlowButton
					onClick={() => setShowGoalForm(true)}
					className="mb-4 w-full"
				>
					+ Add New Goal
				</GlowButton>
			) : (
				<form onSubmit={handleSubmit} className="space-y-4">
					<GlowInput
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Goal Title"
						required
					/>
					<GlowInput
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Goal Description"
					/>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="w-full p-2 bg-deepDark text-white border border-border rounded-md shadow-sm"
					>
						<option value="in_progress">In Progress</option>
						<option value="completed">Completed</option>
						<option value="on_hold">On Hold</option>
						<option value="cancelled">Cancelled</option>
					</select>

					<div className="flex space-x-2">
						<GlowButton type="submit" className="flex-1">
							Save Goal
						</GlowButton>
						<GlowButton
							type="button"
							onClick={() => setShowGoalForm(false)}
							className="flex-1 bg-red-500"
						>
							Cancel
						</GlowButton>
					</div>
				</form>
			)}

			<div className="mt-4 flex justify-end">
				<GlowButton onClick={handleSkipGoalSetting} className="bg-red-500">
					Skip Goal Setting
				</GlowButton>
			</div>

			<div className="mt-4">
				<h3 className="text-lg text-white mb-2">
					Existing Goals for this Entry:
				</h3>
				{goals.length === 0 ? (
					<p className="text-gray-400">No goals yet.</p>
				) : (
					<ul className="space-y-2">
						{goals.map((goal) => (
							<li
								key={goal.id}
								className="p-2 bg-deepDark border border-border rounded-md"
							>
								<h4 className="text-white font-semibold">{goal.title}</h4>
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
									Status: {goal.status}
								</span>
							</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default GoalSetter;

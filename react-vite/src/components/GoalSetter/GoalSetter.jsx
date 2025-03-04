import { useState, useEffect } from "react";
import useGoalsStore from "../../store/goalsStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowInput } from "../UIComponents/Input";
import useEntriesStore from "../../store/entriesStore";

const statusMapping = {
	in_progress: "In Progress",
	completed: "Completed",
	on_hold: "On Hold",
	cancelled: "Cancelled",
};

const GoalSetter = ({ entryId, navigate }) => {
	const { createGoal, goals, clearGoals } = useGoalsStore();
	const { fetchGoalsForEntry } = useEntriesStore;
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
		if (!title.trim()) {
			alert("Title is required to save a goal.");
			return;
		}
		if (!description.trim()) {
			alert("Description is required to save a goal.");
			return;
		}

		if (!entryId) {
			return;
		}

		const newGoal = await createGoal({
			title,
			description,
			status,
			entry_id: entryId,
		});

		// Fetch goals for the specific entry
		await fetchGoalsForEntry(entryId);

		setTitle("");
		setDescription("");
		setStatus("in_progress");
		setShowGoalForm(false);

		if (newGoal && newGoal.id) {
			clearGoals();
			navigate(true);
		}
	};

	const handleSkipGoalSetting = () => {
		if (entryId) {
			clearGoals();
			navigate(`/entries/${entryId}`);
		}
	};

	return (
		<div className="p-4 bg-deepDark rounded-md mb-6 border-violet-500 border shadow-lg shadow-violet-500/50">
			<h2 className="text-xl text-violet-500 font-semibold mb-2">
				Would you like to set a goal associated with this entry?
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
						placeholder="Enter a goal title...(3-100 characters)"
						required
						minLength="3"
						maxLength="100"
					/>
					<GlowInput
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Describe your new goal... at least 10 characters"
						required
						minLength="10"
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
									Status: {statusMapping[goal.status] || "Unknown"}
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

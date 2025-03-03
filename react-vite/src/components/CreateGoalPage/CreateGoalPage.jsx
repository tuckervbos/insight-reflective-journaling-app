import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGoalsStore from "../../store/goalsStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowInput } from "../UIComponents/Input";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";

// Page transition animation
const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const CreateGoalPage = () => {
	const navigate = useNavigate();
	const { createGoal } = useGoalsStore();

	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [status, setStatus] = useState("in_progress");

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
		try {
			const newGoal = await createGoal({
				title,
				description,
				status,
			});
			if (newGoal && newGoal.id) {
				navigate(`/goals/${newGoal.id}`);
			}
		} catch (error) {
			console.error("Failed to create a goal", error);
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
				<h1 className="text-3xl font-semibold text-violet-300 mb-4">
					Create New Goal
				</h1>
				<form onSubmit={handleSubmit} className="space-y-4">
					<GlowInput
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="Goal Title"
						required
						minLength="3"
						maxLength="1000"
					/>
					<GlowInput
						type="text"
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						placeholder="Goal Description"
						required
						minLength="3"
					/>
					<select
						value={status}
						onChange={(e) => setStatus(e.target.value)}
						className="w-full p-2 bg-deepDark text-white border border-border rounded-md shadow-sm"
						required
					>
						<option value="in_progress">In Progress</option>
						<option value="completed">Completed</option>
						<option value="on_hold">On Hold</option>
						<option value="cancelled">Cancelled</option>
					</select>
					<div className="flex justify-between">
						<GlowButton type="submit">Save Goal</GlowButton>
						<GlowButton
							type="button"
							onClick={() => navigate("/goals")}
							className="bg-red-500"
						>
							Cancel
						</GlowButton>
					</div>
				</form>
			</GlowCard>
		</motion.div>
	);
};

export default CreateGoalPage;

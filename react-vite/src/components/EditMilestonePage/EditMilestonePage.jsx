import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useMilestonesStore from "../../store/milestonesStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";

const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const EditMilestonePage = () => {
	const { milestoneId } = useParams();
	const navigate = useNavigate();
	const { fetchMilestoneById, updateMilestone, clearMilestones } =
		useMilestonesStore();

	const [milestoneName, setMilestoneName] = useState("");
	const [isCompleted, setIsCompleted] = useState(false);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadMilestone = async () => {
			try {
				clearMilestones();
				const milestone = await fetchMilestoneById(milestoneId);

				if (milestone) {
					setMilestoneName(milestone.milestone_name);
					setIsCompleted(milestone.is_completed);
				} else {
					setError("Milestone not found.");
				}
			} catch (err) {
				setError("Failed to load milestone.");
			} finally {
				setLoading(false);
			}
		};

		if (milestoneId) {
			loadMilestone();
		} else {
			setError("Milestone not found.");
			setLoading(false);
		}
	}, [milestoneId, fetchMilestoneById, clearMilestones]);

	const handleUpdate = async (e) => {
		e.preventDefault();

		if (!milestoneName.trim()) {
			alert("Milestone name is required.");
			return;
		}

		try {
			await updateMilestone(milestoneId, {
				milestone_name: milestoneName,
				is_completed: isCompleted,
			});
			navigate(`/milestones`);
		} catch (err) {
			setError("Failed to update milestone.");
		}
	};

	if (loading) {
		return <p className="text-center text-gray-400">Loading milestone...</p>;
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
					<GlowButton onClick={() => navigate("/milestones")}>
						Back to Milestones
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
					Edit Milestone
				</h1>
				<form onSubmit={handleUpdate} className="space-y-6">
					<div>
						<label className="block text-gray-300 mb-1">Milestone Name</label>
						<input
							type="text"
							value={milestoneName}
							onChange={(e) => setMilestoneName(e.target.value)}
							className="w-full p-2 bg-deepDark border border-border rounded-md"
							placeholder="Enter milestone name"
							required
						/>
					</div>

					<div>
						<label className="block text-gray-300 mb-1">Status</label>
						<select
							value={isCompleted ? "completed" : "pending"}
							onChange={(e) => setIsCompleted(e.target.value === "completed")}
							className="w-full p-2 bg-deepDark border border-border rounded-md"
						>
							<option value="pending">Pending</option>
							<option value="completed">Completed</option>
						</select>
					</div>

					<div className="flex space-x-4 mt-6">
						<GlowButton type="submit">Update Milestone</GlowButton>
						<GlowButton
							type="button"
							className="bg-red-500"
							onClick={() => navigate(`/milestones`)}
						>
							Cancel
						</GlowButton>
					</div>
				</form>
			</GlowCard>
		</motion.div>
	);
};

export default EditMilestonePage;

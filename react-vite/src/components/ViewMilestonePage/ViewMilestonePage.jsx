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

const ViewMilestonePage = () => {
	const { milestoneId } = useParams();
	const navigate = useNavigate();
	const { fetchMilestoneById, milestone, clearMilestones } =
		useMilestonesStore();

	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const loadMilestone = async () => {
			try {
				clearMilestones();
				const fetchedMilestone = await fetchMilestoneById(milestoneId);
				if (!fetchedMilestone) {
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
					{milestone.milestone_name}
				</h1>
				<p className="text-gray-400 mb-4">
					Status: {milestone.is_completed ? "Completed" : "Pending"}
				</p>
				<div className="flex space-x-4">
					<GlowButton
						onClick={() => navigate(`/milestones/${milestone.id}/edit`)}
					>
						Edit Milestone
					</GlowButton>
					<GlowButton
						className="bg-red-500"
						onClick={() => navigate("/milestones")}
					>
						Back to Milestones
					</GlowButton>
				</div>
			</GlowCard>
		</motion.div>
	);
};

export default ViewMilestonePage;

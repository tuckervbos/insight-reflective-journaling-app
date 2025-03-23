import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useMilestonesStore from "../../store/milestonesStore";
import { GlowButton } from "../UIComponents/Button";
import { GlowCard } from "../UIComponents/Card";
import { motion } from "framer-motion";

const pageVariants = {
	initial: { opacity: 0, y: 50 },
	animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
	exit: { opacity: 0, y: -50, transition: { duration: 0.3 } },
};

const MilestonesPage = () => {
	const navigate = useNavigate();
	const { fetchMilestones, milestones, deleteMilestone } = useMilestonesStore();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const loadMilestones = async () => {
			await fetchMilestones();
			setLoading(false);
		};
		loadMilestones();
	}, [fetchMilestones]);

	if (loading) {
		return <p className="text-center text-gray-400">Loading milestones...</p>;
	}

	const sortedMilestones = [...milestones].sort(
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
					Your Milestones
				</h1>
				<div className="mt-6 mb-5 mr-2 flex justify-end">
					<GlowButton onClick={() => navigate("/milestones/new")}>
						Add New Milestone
					</GlowButton>
				</div>
				{sortedMilestones.length === 0 ? (
					<p className="text-gray-500">
						No milestones found. Start setting new milestones!
					</p>
				) : (
					<ul className="space-y-4">
						{sortedMilestones.map((milestone) => (
							<GlowCard
								key={milestone.id}
								className="p-4 bg-deepDark rounded-md border border-border flex justify-between items-center"
							>
								<div className="flex-grow">
									<h2 className="text-xl text-white font-semibold">
										{milestone.milestone_name}
									</h2>
									<span
										className={`text-sm ${
											milestone.is_completed
												? "text-green-400"
												: "text-yellow-400"
										}`}
									>
										Status: {milestone.is_completed ? "Completed" : "Pending"}
									</span>
								</div>

								<div className="flex space-x-4">
									<GlowButton
										onClick={() => navigate(`/milestones/${milestone.id}/edit`)}
										className="mt-2"
									>
										Edit
									</GlowButton>
									<GlowButton
										onClick={async () => {
											const isConfirmed = window.confirm(
												"Are you sure you want to delete this milestone?"
											);
											if (isConfirmed) {
												await deleteMilestone(milestone.id);
												await fetchMilestones();
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
			</GlowCard>
		</motion.div>
	);
};

export default MilestonesPage;

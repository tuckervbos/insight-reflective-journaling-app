import useSessionStore from "../../store/sessionStore";
import useEntriesStore from "../../store/entriesStore";
import useInsightStore from "../../store/insightStore";
import useMilestonesStore from "../../store/milestonesStore";
import useGoalsStore from "../../store/goalsStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { GlowButton, GlowCard, DarkThemeProvider } from "../UIComponents";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import JournalCalendar from "../Calendar/JournalCalendar";
import GoalsOverview from "../GoalsOverview/GoalsOverview";
import EntriesOverview from "../EntriesOverview/EntriesOverview";
import InsightForm from "../InsightForm/InsightForm";
import InsightList from "../InsightList/InsightList";
import GradientCursorEffect from "../UIComponents/GradientCursorEffect";
import GlobalInsightButton from "./GlobalInsightButton";

function HomePage() {
	const user = useSessionStore((state) => state.user);
	const authenticate = useSessionStore((state) => state.authenticate);
	const { fetchEntries } = useEntriesStore();
	const { loadInsights, insights } = useInsightStore();
	const navigate = useNavigate();

	useEffect(() => {
		authenticate();
		fetchEntries();
	}, [authenticate, fetchEntries]);

	useEffect(() => {
		if (!user) {
			navigate("/");
		}
	}, [user, navigate]);

	// useEffect(() => {
	// 	const { insights, loadInsights } = useInsightStore.getState();
	// 	if (insights.length === 0) loadInsights();
	// }, []);

	useEffect(() => {
		if (!insights.length) loadInsights();
	}, [insights.length, loadInsights]);

	return (
		<DarkThemeProvider>
			<div className="min-h-screen flex flex-col items-left justify-center bg-black text-white px-4 py-12">
				<h1 className="text-5xl font-extralight text-violet-400 mb-6">
					Welcome to Insight
				</h1>
				<p className="text-gray-400 mb-2">Breathe and relax.</p>
				<p className="text-gray-400 mb-2">
					Reflect on your thoughts and track your progress in a new entry.
				</p>
				<p className="text-gray-400 mb-2">
					Set your sights on a new goal, or celebrate an achievement with a new
					milestone!
				</p>
				<p className="text-gray-400 mb-2">
					Tap the New Insight button to allow ChatGPT to view your data, analyze
					trends, and provide feedback and support.
				</p>
				<p className="text-gray-400 mb-6">
					Ask the assistant anything! Responses will be saved for later
					reference.
				</p>

				{/* Main Layout Grid */}
				<div className="grid grid-cols-12 gap-2 w-full max-w-6xl">
					{/* Left: Calendar */}
					<div className="col-span-5">
						<GlowCard className=" w-full">
							<JournalCalendar />
						</GlowCard>
						<GlowCard className="p-4">
							<WeatherFetcher />
						</GlowCard>
						<GlowCard className="w-full mt-4 ">
							<GoalsOverview />
						</GlowCard>
					</div>

					{/* center buttons */}
					<div className="col-span-2 flex flex-col items-center space-y-4 self-start p-1 pt-2">
						<GlobalInsightButton />
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/entries/new")}
						>
							New Entry
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/goals/new")}
						>
							New Goal
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/milestones/new")}
						>
							New Milestone
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/insights")}
						>
							View Insights
						</GlowButton>
						<GlowButton
							className="px-2 py-3 text-xs w-full"
							onClick={() => navigate("/entries")}
						>
							View Entries
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/goals")}
						>
							View Goals
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/milestones")}
						>
							View Milestones
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs font-extralight w-full"
							onClick={() => navigate("/profile")}
						>
							Profile
						</GlowButton>
					</div>

					{/* right: Weather + Recent Entries (Stacked, Smaller than before) */}
					<div className="col-span-5 flex flex-col space-y-5">
						{/* AI Assistant Section */}
						<GlowCard>
							<div className="">
								{/* <h2 className="text-xl text-center font-light text-violet-400 mb-2">
									AI Assistant
								</h2> */}
								<div className="flex flex-col space-y-4">
									<InsightForm />

									<InsightList limit={2} showViewButton />
								</div>
							</div>
						</GlowCard>

						<GlowCard className="p-4">
							<EntriesOverview />
						</GlowCard>
					</div>
				</div>
			</div>
		</DarkThemeProvider>
	);
}

export default HomePage;

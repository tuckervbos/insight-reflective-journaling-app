import useSessionStore from "../../store/sessionStore";
import useEntriesStore from "../../store/entriesStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import { GlowButton, GlowCard, DarkThemeProvider } from "../UIComponents";
import JournalCalendar from "../Calendar/JournalCalendar";
import GoalsOverview from "../GoalsOverview/GoalsOverview";
import EntriesOverview from "../EntriesOverview/EntriesOverview";
import AIInteractionForm from "../AIInteractionForm/AIInteractionForm";
import AIInteractionList from "../AIInteractionList/AIInteractionList";

function HomePage() {
	const user = useSessionStore((state) => state.user);
	const authenticate = useSessionStore((state) => state.authenticate);
	const { fetchEntries } = useEntriesStore();
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

	return (
		<DarkThemeProvider>
			<div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 py-12">
				<h1 className="text-5xl font-extralight text-violet-400 mb-6">
					welcome to insight
				</h1>
				<p className="text-gray-400 mb-6">
					Reflect on your thoughts and track your progress.
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
						<GlowButton
							className="px-2 py-2 text-xs font-extralight w-full"
							onClick={() => navigate("/profile")}
						>
							Profile
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/entries/new")}
						>
							New Entry
						</GlowButton>
						<GlowButton
							className="px-2 py-3 text-xs w-full"
							onClick={() => navigate("/entries")}
						>
							View Entries
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/goals/new")}
						>
							New Goal
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/goals")}
						>
							View Goals
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/milestones/new")}
						>
							New Milestone
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/milestones")}
						>
							View Milestones
						</GlowButton>
					</div>

					{/* right: Weather + Recent Entries (Stacked, Smaller than before) */}
					<div className="col-span-5 flex flex-col space-y-5">
						{/* AI Assistant Section */}
						<GlowCard>
							<div className="bg-black text-white p-4 rounded-lg border border-violet-500 shadow-lg shadow-violet-500/50">
								<h2 className="text-xl font-light text-violet-400 mb-2">
									AI Assistant
								</h2>
								<div className="flex flex-col space-y-4">
									<GlowCard>
										<AIInteractionForm />
									</GlowCard>
									<GlowCard>
										<AIInteractionList />
									</GlowCard>
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

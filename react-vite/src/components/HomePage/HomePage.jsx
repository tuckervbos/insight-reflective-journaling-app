import useSessionStore from "../../store/sessionStore";
import useEntriesStore from "../../store/entriesStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import { GlowButton, GlowCard, DarkThemeProvider } from "../UIComponents";
import JournalCalendar from "../Calendar/JournalCalendar";
import GoalsOverview from "../GoalsOverview/GoalsOverview";
import EntriesOverview from "../EntriesOverview/EntriesOverview";

function HomePage() {
	const user = useSessionStore((state) => state.user);
	const authenticate = useSessionStore((state) => state.authenticate);
	const { entries, fetchEntries } = useEntriesStore();
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
					Welcome to Insight
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
						<GlowCard className="w-full mt-4 ">
							<GoalsOverview />
						</GlowCard>
					</div>

					{/* center buttons */}
					<div className="col-span-2 flex flex-col items-center space-y-4 self-start p-2">
						<GlowButton
							className="px-2 py-2 text-xs w-full"
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
					</div>

					{/* right: Weather + Recent Entries (Stacked, Smaller than before) */}
					<div className="col-span-5 flex flex-col space-y-5">
						<GlowCard className="p-4">
							<WeatherFetcher />
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

import useSessionStore from "../../store/sessionStore";
import useEntriesStore from "../../store/entriesStore";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import { GlowButton, GlowCard, DarkThemeProvider } from "../UIComponents";
import JournalCalendar from "../Calendar/JournalCalendar";

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
					{/* Left: Calendar (Wider than before) */}
					<div className="col-span-5">
						<GlowCard className=" w-full">
							<JournalCalendar />
						</GlowCard>
					</div>

					{/* center buttons */}
					<div className="col-span-2 flex flex-col items-center space-y-4 self-start p-2">
						<GlowButton
							className="px-2 py-3 text-xs w-full"
							onClick={() => navigate("/entries")}
						>
							View Entries
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/entries/new")}
						>
							New Entry
						</GlowButton>
						<GlowButton
							className="px-2 py-2 text-xs w-full"
							onClick={() => navigate("/profile")}
						>
							Profile
						</GlowButton>
					</div>

					{/* Center: Weather + Recent Entries (Stacked, Smaller than before) */}
					<div className="col-span-5 flex flex-col space-y-5">
						<GlowCard className="p-4">
							<WeatherFetcher />
						</GlowCard>
						<GlowCard className="p-4">
							<h2 className="text-violet-400 text-lg font-semibold mb-4">
								Recent Entries
							</h2>
							{entries && entries.length > 0 ? (
								entries.slice(0, 5).map((entry) => (
									<div
										key={entry.id}
										className="border-b border-violet-500 p-2"
									>
										<p className="text-gray-300">{entry.title}</p>
										<p
											className={`text-sm ${
												entry.sentiment?.toLowerCase() === "positive"
													? "text-green-400"
													: entry.sentiment?.toLowerCase() === "negative"
													? "text-red-400"
													: "text-gray-400"
											}`}
										>
											{entry.sentiment || "No Sentiment"}
										</p>
									</div>
								))
							) : (
								<p className="text-gray-500">No entries yet.</p>
							)}
						</GlowCard>
					</div>
				</div>
			</div>
		</DarkThemeProvider>
	);
}

export default HomePage;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEntriesStore from "../../store/entriesStore";

const sentimentColors = {
	positive: "bg-green-500",
	negative: "bg-red-500",
	neutral: "bg-gray-500",
};

const JournalCalendar = () => {
	const navigate = useNavigate();
	const { entries, fetchEntries } = useEntriesStore();
	const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
	const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

	useEffect(() => {
		fetchEntries();
	}, [fetchEntries]);

	useEffect(() => {
		entries.map((e) => ({
			date: e.date,
			sentiment: e.sentiment,
		}));
	}, [entries]);

	const daysInMonth = new Date(selectedYear, selectedMonth + 1, 0).getDate();
	const firstDayOfMonth = new Date(selectedYear, selectedMonth, 1).getDay();

	const getEntryForDate = (day) => {
		const formattedDate = new Date(
			selectedYear,
			selectedMonth,
			day
		).toLocaleDateString("en-CA"); // Ensures format "YYYY-MM-DD"

		// Filter entries for this date
		const entriesForDate = entries.filter((entry) => {
			if (!entry || !entry.created_at) return false;
			return (
				new Date(entry.created_at).toLocaleDateString("en-CA") === formattedDate
			);
		});

		if (entriesForDate.length === 0) {
			return null;
		}

		// Sort entries by date (newest first)
		entriesForDate.sort(
			(a, b) => new Date(b.created_at) - new Date(a.created_at)
		);

		// Get the latest entry
		const latestEntry = entriesForDate[0];
		return latestEntry;
	};

	return (
		<div className="bg-black p-3 rounded-lg shadow-violet-500/50 shadow-lg w-auto border border-violet-500">
			<h2 className="text-lg font-semibold text-violet-400 mb-2 text-center">
				Calendar
			</h2>

			{/* Month Selector */}
			<div className="flex justify-between items-center text-violet-400 mb-2">
				<button
					className="px-2 py-1 border border-violet-500 rounded-md hover:bg-violet-600 transition"
					onClick={() =>
						setSelectedMonth((prev) => (prev === 0 ? 11 : prev - 1))
					}
				>
					◀
				</button>
				<span className="text-sm">
					{new Date(selectedYear, selectedMonth).toLocaleString("default", {
						month: "long",
						year: "numeric",
					})}
				</span>
				<button
					className="px-2 py-1 border border-violet-500 rounded-md hover:bg-violet-600 transition"
					onClick={() =>
						setSelectedMonth((prev) => (prev === 11 ? 0 : prev + 1))
					}
				>
					▶
				</button>
			</div>

			{/* Calendar Grid */}
			<div className="grid grid-cols-7 gap-1 text-center text-gray-300">
				{["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
					<div key={day} className="text-violet-300 text-xs font-semibold">
						{day}
					</div>
				))}

				{/* Empty spaces for first row */}
				{Array(firstDayOfMonth)
					.fill(null)
					.map((_, i) => (
						<div key={`empty-${i}`} className="h-8"></div>
					))}

				{/* Calendar Days */}
				{Array.from({ length: daysInMonth }, (_, i) => {
					const day = i + 1;
					const entry = getEntryForDate(day);

					// Ensure we have a valid sentiment, otherwise default to "neutral"
					// const sentiment = entry?.sentiment?.toLowerCase() || "neutral";

					return (
						<button
							key={i}
							className={`h-8 w-8 flex items-center justify-center rounded-md border border-violet-500 transition
                ${
									entry
										? sentimentColors[entry.sentiment?.toLowerCase()]
										: "bg-black"
								}`}
							onClick={() => entry && navigate(`/entries/${entry.id}`)}
						>
							<span className="font-semibold text-sm text-white">{day}</span>
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default JournalCalendar;

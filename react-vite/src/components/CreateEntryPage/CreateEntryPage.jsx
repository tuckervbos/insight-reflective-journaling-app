import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEntry, updateEntry } from "../../utils/api";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import { GlowButton, GlowCard } from "../UIComponents";
import GoalSetter from "../GoalSetter/GoalSetter";
import useGoalsStore from "../../store/goalsStore";
import InsightForm from "../InsightForm/InsightForm";
// import InsightList from "../InsightList/InsightList";

const CreateEntryPage = () => {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [location, setLocation] = useState(null);
	const [weather, setWeather] = useState(null);
	const [moonPhase, setMoonPhase] = useState(null);
	const [error, setError] = useState(null);
	const [entryId, setEntryId] = useState(null);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showGoalSetter, setShowGoalSetter] = useState(false);
	const navigate = useNavigate();

	const { clearGoals } = useGoalsStore();

	const handleSubmit = async (e) => {
		e.preventDefault();

		if (!title || !body) {
			setError("Title and body are required.");
			return;
		}

		setIsSubmitting(true);

		try {
			const entryData = {
				title,
				body,
				weather: weather
					? `${weather.weatherDescription}, ${weather.temperature}`
					: "Unknown",
				moon_phase: moonPhase || "Unknown",
			};

			if (!entryId) {
				const newEntry = await createEntry(entryData, location);
				if (newEntry?.id) {
					clearGoals();
					setEntryId(newEntry.id);
					setShowGoalSetter(true); // Ensure goal setter is shown
				} else {
					setError("Failed to create a new entry.");
				}
			} else {
				await updateEntry(entryId, entryData);
				navigate(`/entries/${entryId}`);
			}
		} catch (err) {
			setError("Failed to save entry.");
		} finally {
			setIsSubmitting(false);
		}
	};

	// Navigate directly if no goal is being set
	const handleSkipGoalSetting = () => {
		if (entryId) {
			navigate(`/entries/${entryId}`);
			clearGoals();
		}
	};

	// After goal is saved, navigate to the entry view
	const handleGoalSaved = (goalSaved) => {
		if (goalSaved && entryId) {
			clearGoals();
			navigate(`/entries/${entryId}`);
		}
	};

	return (
		<div className="bg-black text-gray-300 p-6 rounded-lg shadow-glow max-w-3xl mx-auto">
			<h2 className="text-3xl font-extralight text-blurple mb-4">
				Create New Journal Entry
			</h2>
			{error && <p className="text-red-400">{error}</p>}

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Title (3-100 characters)"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					className="w-full p-3 border border-violet-500 rounded-md focus:ring focus:ring-violet mb-4 shadow-lg shadow-violet-500/50"
					required
					minLength="3"
					maxLength="100"
				/>

				<WeatherFetcher
					onWeatherFetched={(weatherData, moonPhaseData) => {
						setWeather(weatherData);
						setMoonPhase(moonPhaseData || "Unknown");
					}}
				/>

				{/* AI Insight Assistant */}

				<div className="mt-8">
					{/* <GlowCard> */}
					<InsightForm entryId={entryId} />
					{/* </GlowCard> */}
					{/* <div className="mt-6">
						<GlowCard>
							<InsightList />
						</GlowCard>
					</div> */}
				</div>

				<textarea
					placeholder="Write your journal entry here...(at least 10 characters)"
					value={body}
					onChange={(e) => setBody(e.target.value)}
					className="w-full h-100 p-3  mt-4 border border-violet-500 rounded-md focus:ring focus:ring-violet mb-4 shadow-lg shadow-violet-500/50"
					required
					minLength="10"
				></textarea>

				{isSubmitting && <p className="text-yellow-500">Saving entry...</p>}

				{/* Initial Save Entry button before goal setting */}
				{!entryId && (
					<div className="mt-4 flex justify-end">
						<GlowButton type="submit">Save Entry</GlowButton>
					</div>
				)}
			</form>

			{/* Render GoalSetter only after entry is created */}
			{entryId && showGoalSetter && (
				<div className="mt-6">
					<GoalSetter entryId={entryId} navigate={handleGoalSaved} />

					{/* Always render the Save Entry button after GoalSetter */}
					<div className="mt-4 flex justify-end">
						<GlowButton onClick={handleSkipGoalSetting}>Save Entry</GlowButton>
					</div>
				</div>
			)}
		</div>
	);
};

export default CreateEntryPage;

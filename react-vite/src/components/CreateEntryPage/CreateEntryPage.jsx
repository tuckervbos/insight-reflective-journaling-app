import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEntry } from "../../utils/api";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import { GlowButton } from "../UIComponents";

const CreateEntryPage = () => {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [location, setLocation] = useState(null);
	const [weather, setWeather] = useState(null);
	const [moonPhase, setMoonPhase] = useState(null);
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleCreateEntry = async () => {
		try {
			if (!title || !body) {
				setError("Title and body are required.");
				return;
			}

			const entryData = {
				title,
				body,
				weather: weather
					? `${weather.weatherDescription}, ${weather.temperature}`
					: "Unknown",
				moon_phase: moonPhase || "Unknown",
			};

			console.log("Final Entry Data Before Save:", entryData);

			await createEntry(entryData, location);
			navigate("/entries"); // Redirect after successful creation
		} catch (err) {
			setError("Failed to create entry.");
		}
	};

	return (
		<div className="bg-black text-gray-300 p-6 rounded-lg shadow-glow max-w-3xl mx-auto">
			<h2 className="text-3xl font-semibold text-blurple mb-4">
				Create New Journal Entry
			</h2>
			{error && <p className="text-red-400">{error}</p>}

			<input
				type="text"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
				className="w-full p-3 border border-violet-500 rounded-md focus:ring focus:ring-violet mb-4 shadow-lg shadow-violet-500/50"
			/>
			<textarea
				placeholder="Write your journal entry here..."
				value={body}
				onChange={(e) => setBody(e.target.value)}
				className="w-full h-100 p-3 border border-violet-500 rounded-md focus:ring focus:ring-violet mb-4 shadow-lg shadow-violet-500/50"
			></textarea>

			{/* <WeatherFetcher
				onWeatherFetched={(weatherData, moonPhaseData) => {
					console.log("Weather Data in CreateEntryPage:", weatherData);
					console.log("Moon Phase Data in CreateEntryPage:", moonPhaseData);
					setWeather(weatherData);
					setMoonPhase(moonPhaseData ? moonPhaseData : "Unknown");
				}}
			/> */}

			<WeatherFetcher
				onWeatherFetched={(weatherData, moonPhaseData) => {
					console.log(
						"✅ Received in CreateEntryPage.jsx - Weather Data:",
						weatherData
					);
					console.log(
						"✅ Received in CreateEntryPage.jsx - Moon Phase Data:",
						moonPhaseData
					);

					if (!moonPhaseData || moonPhaseData === "Unknown") {
						console.error("🚨 Issue: Moon Phase is still 'Unknown'!");
					}

					setWeather(weatherData);
					setMoonPhase(moonPhaseData || "Unknown"); // Make sure it's updating state
				}}
			/>

			<div className="mt-4 flex justify-end">
				<GlowButton onClick={handleCreateEntry}>Save Entry</GlowButton>
			</div>
		</div>
	);
};

export default CreateEntryPage;

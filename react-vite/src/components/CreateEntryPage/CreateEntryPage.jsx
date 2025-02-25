import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createEntry } from "../../utils/api";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";

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
		<div>
			<h2>Create New Journal Entry</h2>
			{error && <p style={{ color: "red" }}>{error}</p>}

			<input
				type="text"
				placeholder="Title"
				value={title}
				onChange={(e) => setTitle(e.target.value)}
			/>
			<textarea
				placeholder="Write your journal entry here..."
				value={body}
				onChange={(e) => setBody(e.target.value)}
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

			<button onClick={handleCreateEntry}>Save Entry</button>
		</div>
	);
};

export default CreateEntryPage;

import { useState, useEffect, useCallback } from "react";
import { GlowButton } from "../UIComponents";

const WeatherFetcher = ({ onWeatherFetched = () => {} }) => {
	const [location, setLocation] = useState("");
	const [weather, setWeather] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [moonPhase, setMoonPhase] = useState(null);

	// fetch moon phase from backend
	const fetchMoonPhase = async () => {
		try {
			if (moonPhase) return;
			const response = await fetch("/api/entries/moon-phase");
			if (!response.ok) throw new Error("Moon phase data unavailable.");
			const data = await response.json();
			console.log("🌙 Moon Phase API Response:", data);
			const phase = data.phase || "Unknown";
			setMoonPhase(phase);
			return phase;
		} catch (err) {
			setMoonPhase("Unknown");
			console.error("Failed to fetch moon phase:", err);
			return "Unknown";
		}
	};

	// function to fetch weather using coordinates
	const fetchWeatherByCoords = useCallback(async (lat, lon) => {
		try {
			setLoading(true);
			setError(null);
			const response = await fetch(
				`/api/entries/weather?lat=${lat}&lon=${lon}`
			);
			if (!response.ok) throw new Error("Invalid response from weather API.");

			const data = await response.json();
			console.log("Weather API Response:", data); // Debugging log

			const moonPhaseData = await fetchMoonPhase();

			const weatherDescription = data?.weather || "No description";
			const temperature =
				data?.temperature !== "N/A"
					? `${data.temperature}`
					: "No temperature data";
			const city = data?.city || "Unknown City";
			const country = data?.country || "Unknown Country";

			setWeather({ weatherDescription, temperature, city, country });
			console.log("Final Moon Phase Data:", moonPhaseData); // Debugging
			setError(null);
			onWeatherFetched(
				{ weatherDescription, temperature, city, country },
				moonPhaseData
			);
		} catch (err) {
			setError(
				"Failed to fetch weather data. Try entering your city manually."
			);
			console.error(err);
		} finally {
			setLoading(false);
		}
	}, []);

	// auto-detect location on component mount
	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				(position) => {
					const { latitude, longitude } = position.coords;
					fetchWeatherByCoords(latitude, longitude);
					fetchMoonPhase();
				},
				() => {
					setError("Location permission denied. Enter city manually.");
				}
			);
		} else {
			setError("Geolocation is not supported. Enter city manually.");
		}
	}, []);

	// Fetch weather by city name
	const fetchWeatherByCity = async () => {
		if (!location.trim()) {
			setError("Please enter a city or allow location access.");
			return;
		}
		try {
			setLoading(true);
			setError(null);
			const response = await fetch(`/api/entries/weather?city=${location}`);
			if (!response.ok) throw new Error("Invalid response from weather API.");
			const data = await response.json();
			setWeather(data);
			setError(null);
			onWeatherFetched(`${data.name}, ${data.sys.country}`);
			fetchMoonPhase();
		} catch (err) {
			setError(
				"Failed to fetch weather data. Check the city name and try again."
			);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="bg-black text-white p-4 rounded-lg border border-violet-500 shadow-lg shadow-violet-500/50">
			{loading && <p className="text-violet-300">Fetching weather data...</p>}
			{error && <p className="text-red-500">{error}</p>}
			{!weather && (
				<div className="flex flex-col space-y-2">
					<input
						type="text"
						placeholder="Enter city or ZIP code"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
						className="bg-background text-white border border-gray-600 p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
					/>
					<GlowButton onClick={fetchWeatherByCity} className="bg-violet-600">
						Get Weather
					</GlowButton>
				</div>
			)}
			{weather && (
				<div>
					<h3 className="text-lg font-semibold text-violet-400">
						Weather in{" "}
						{weather.city
							? `${weather.city}, ${weather.country}`
							: "Unknown Location"}
					</h3>
					<p className="text-gray-300">
						{weather.weatherDescription}, {weather.temperature}°F
					</p>
					<h4 className="text-md text-gray-400">
						Moon Phase: {moonPhase || "Loading..."}
					</h4>
				</div>
			)}
		</div>
	);
};

export default WeatherFetcher;

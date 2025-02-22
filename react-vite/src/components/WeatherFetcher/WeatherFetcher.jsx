import { useState, useEffect, useCallback } from "react";

const WeatherFetcher = ({ onWeatherFetched }) => {
	const [location, setLocation] = useState("");
	const [weather, setWeather] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const [moonPhase, setMoonPhase] = useState(null);

	// fetch moon phase from backend
	const fetchMoonPhase = async () => {
		try {
			const response = await fetch("/api/entries/moon-phase");
			if (!response.ok) throw new Error("Moon phase data unavailable.");
			const data = await response.json();
			setMoonPhase(data.phase || "Unknown");
		} catch (err) {
			setMoonPhase("Unknown");
			console.error("Failed to fetch moon phase:", err);
		}
	};

	// Function to fetch weather using coordinates
	const fetchWeatherByCoords = useCallback(
		async (lat, lon) => {
			try {
				setLoading(true);
				setError(null);
				const response = await fetch(
					`/api/entries/weather?lat=${lat}&lon=${lon}`
				);
				if (!response.ok) throw new Error("Invalid response from weather API.");
				const data = await response.json();
				setWeather(data);
				onWeatherFetched(`${data.name}, ${data.sys.country}`);
			} catch (err) {
				setError(
					"Failed to fetch weather data. Try entering your city manually."
				);
			} finally {
				setLoading(false);
			}
		},
		[onWeatherFetched]
	);

	// Auto-detect location on component mount
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
	}, [fetchWeatherByCoords]);

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
		<div>
			{loading && <p>fetching weather data...</p>}
			{error && <p style={{ color: "red" }}>{error}</p>}
			{!weather && (
				<div>
					<input
						type="text"
						placeholder="Enter city or ZIP code"
						value={location}
						onChange={(e) => setLocation(e.target.value)}
					/>
					<button onClick={fetchWeatherByCity}>get weather</button>
				</div>
			)}
			{weather && (
				<div>
					<h3>
						weather in {weather.name}, {weather.sys.country}
					</h3>
					<p>
						{weather.weather[0].description}, {weather.main.temp}°F
					</p>
					<img
						src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
						alt="Weather Icon"
					/>
					<h4>Moon Phase: {moonPhase || "Loading..."}</h4>
				</div>
			)}
		</div>
	);
};

export default WeatherFetcher;

import { useState } from "react";
import { createEntry } from "../../utils/api";
import WeatherFetcher from "../WeatherFetcher/WeatherFetcher";
import { useNavigate } from "react-router-dom";

const CreateEntryPage = () => {
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [location, setLocation] = useState(""); // Store fetched location
	const [error, setError] = useState(null);
	const navigate = useNavigate();

	const handleCreateEntry = async () => {
		try {
			if (!title || !body) {
				setError("Title and body are required.");
				return;
			}
			await createEntry({ title, body }, location); // Send location
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

			{/* Integrate WeatherFetcher */}
			<WeatherFetcher onWeatherFetched={setLocation} />

			<button onClick={handleCreateEntry}>Save Entry</button>
		</div>
	);
};

export default CreateEntryPage;

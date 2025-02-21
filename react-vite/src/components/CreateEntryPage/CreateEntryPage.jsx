import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useEntriesStore from "../../store/entriesStore";

const CreateEntryPage = () => {
	const { createEntry } = useEntriesStore();
	const navigate = useNavigate();

	// State for form inputs
	const [title, setTitle] = useState("");
	const [body, setBody] = useState("");
	const [error, setError] = useState(null);

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!title.trim() || !body.trim()) {
			setError("Both fields are required.");
			return;
		}

		try {
			await createEntry({ title, body });
			navigate("/entries"); // Redirect to entries page after submission
		} catch (err) {
			setError("Failed to create entry. Try again.");
		}
	};

	return (
		<div>
			<h1>Create New Journal Entry</h1>

			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder="Entry Title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					placeholder="Write your journal entry here..."
					value={body}
					onChange={(e) => setBody(e.target.value)}
				/>
				<button type="submit">Save Entry</button>
			</form>

			{error && <p style={{ color: "red" }}>{error}</p>}

			<button onClick={() => navigate("/entries")}>Cancel</button>
		</div>
	);
};

export default CreateEntryPage;

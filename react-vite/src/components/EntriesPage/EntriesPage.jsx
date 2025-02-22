import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useEntriesStore from "../../store/entriesStore";
// import { authenticate } from "../../utils/api";

const EntriesPage = () => {
	const { entries, fetchEntries, updateEntry, deleteEntry } = useEntriesStore();
	const navigate = useNavigate();

	useEffect(() => {
		fetchEntries();
	}, [fetchEntries]);

	return (
		<div>
			<h1>Your Journal Entries</h1>
			<button onClick={() => navigate("/entries/new")}>Add New Entry</button>

			<ul>
				{entries.length > 0 ? (
					entries.map((entry) => (
						<li key={entry.id}>
							<h2>{entry.title}</h2>
							<p>{entry.body}</p>
							<button
								onClick={() =>
									updateEntry(entry.id, { title: "Updated Title" })
								}
							>
								Edit
							</button>
							<button onClick={() => deleteEntry(entry.id)}>Delete</button>
						</li>
					))
				) : (
					<p>No entries found.</p>
				)}
			</ul>
		</div>
	);
};

export default EntriesPage;

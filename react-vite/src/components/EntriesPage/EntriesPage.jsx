import { useEffect } from "react";
import useEntriesStore from "../../store/entriesStore";

const EntriesPage = () => {
	const { entries, fetchEntries, createEntry, updateEntry, deleteEntry } =
		useEntriesStore();

	useEffect(() => {
		fetchEntries(); // Fetch entries on mount
	}, [fetchEntries]);

	return (
		<div>
			<h1>Your Journal Entries</h1>
			<button
				onClick={() =>
					createEntry({ title: "New Entry", body: "New journal entry content" })
				}
			>
				Add Entry
			</button>
			<ul>
				{entries.map((entry) => (
					<li key={entry.id}>
						<h2>{entry.title}</h2>
						<p>{entry.body}</p>
						<button
							onClick={() => updateEntry(entry.id, { title: "Updated Title" })}
						>
							Edit
						</button>
						<button onClick={() => deleteEntry(entry.id)}>Delete</button>
					</li>
				))}
			</ul>
		</div>
	);
};

export default EntriesPage;

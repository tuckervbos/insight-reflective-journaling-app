import { create } from "zustand";
import {
	fetchEntries,
	createEntry,
	updateEntry,
	deleteEntry,
	fetchEntryById,
} from "../utils/api";

const useEntriesStore = create((set) => ({
	entries: [],

	// Fetch all entries
	fetchEntries: async () => {
		const data = await fetchEntries();
		set({ entries: data });
	},

	// Fetch an entry by an ID
	fetchEntryById: async (id) => {
		const entry = await fetchEntryById(id);
		set((state) => ({
			entries: [...state.entries.filter((e) => e.id !== id), entry],
		}));
		return entry;
	},

	// Create a new entry
	createEntry: async (entryData) => {
		const newEntry = await createEntry(entryData);
		set((state) => ({ entries: [...state.entries, newEntry] }));
	},

	// Update an entry
	updateEntry: async (id, updatedData) => {
		const updatedEntry = await updateEntry(id, updatedData);
		set((state) => ({
			entries: state.entries.map((entry) =>
				entry.id === id ? updatedEntry : entry
			),
		}));
	},

	// Delete an entry
	deleteEntry: async (id) => {
		await deleteEntry(id);
		set((state) => ({
			entries: state.entries.filter((entry) => entry.id !== id),
		}));
	},

	// Set entries directly (useful for setting fetched data)
	setEntries: (entries) => set({ entries }),
}));

export default useEntriesStore;

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
		try {
			const data = await fetchEntries();
			set({ entries: data });
		} catch (error) {
			console.error("Error fetching entries:", error);
		}
	},

	// Fetch an entry by an ID
	fetchEntryById: async (id) => {
		try {
			const entry = await fetchEntryById(id);
			set((state) => ({
				entries: [...state.entries.filter((e) => e.id !== id), entry],
			}));
			return entry;
		} catch (error) {
			console.error("Error fetching entry by ID:", error);
			throw error;
		}
	},

	// Create a new entry
	createEntry: async (entryData) => {
		try {
			const newEntry = await createEntry(entryData);
			set((state) => ({ entries: [...state.entries, newEntry] }));
		} catch (error) {
			console.error("Error creating entry:", error);
		}
	},

	// Update an entry
	updateEntry: async (id, updatedData) => {
		try {
			const updatedEntry = await updateEntry(id, updatedData);
			set((state) => ({
				entries: state.entries.map((entry) =>
					entry.id === id ? updatedEntry : entry
				),
			}));
		} catch (error) {
			console.error("Error updating entry:", error);
		}
	},

	// Delete an entry
	deleteEntry: async (id) => {
		try {
			await deleteEntry(id);
			set((state) => ({
				entries: state.entries.filter((entry) => entry.id !== id),
			}));
		} catch (error) {
			console.error("Error deleting entry:", error);
		}
	},

	// Set entries directly (useful for setting fetched data)
	setEntries: (entries) => set({ entries }),
}));

export default useEntriesStore;

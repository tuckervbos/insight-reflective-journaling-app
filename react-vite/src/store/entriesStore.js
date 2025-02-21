import { create } from "zustand";
import {
	fetchEntries,
	createEntry,
	updateEntry,
	deleteEntry,
} from "../utils/api"; // Use correct imports

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
}));

export default useEntriesStore;

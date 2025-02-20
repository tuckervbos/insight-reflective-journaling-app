import { create } from "zustand";

// Define Zustand store
const useEntriesStore = create((set, get) => ({
	entries: [],

	// Fetch all entries
	fetchEntries: async () => {
		try {
			const response = await fetch("/api/entries/", {
				method: "GET",
				credentials: "include",
			});
			if (!response.ok) throw new Error("Failed to fetch entries");
			const data = await response.json();
			set({ entries: data });
		} catch (error) {
			console.error("Error fetching entries:", error);
		}
	},

	// Create a new entry
	createEntry: async (entryData) => {
		try {
			const response = await fetch("/api/entries/", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(entryData),
			});
			if (!response.ok) throw new Error("Failed to create entry");
			const newEntry = await response.json();
			set({ entries: [...get().entries, newEntry] });
		} catch (error) {
			console.error("Error creating entry:", error);
		}
	},

	// Update an entry
	updateEntry: async (id, updatedData) => {
		try {
			const response = await fetch(`/api/entries/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify(updatedData),
			});
			if (!response.ok) throw new Error("Failed to update entry");
			const updatedEntry = await response.json();
			set({
				entries: get().entries.map((entry) =>
					entry.id === id ? updatedEntry : entry
				),
			});
		} catch (error) {
			console.error("Error updating entry:", error);
		}
	},

	// Delete an entry
	deleteEntry: async (id) => {
		try {
			const response = await fetch(`/api/entries/${id}`, {
				method: "DELETE",
				credentials: "include",
			});
			if (!response.ok) throw new Error("Failed to delete entry");
			set({
				entries: get().entries.filter((entry) => entry.id !== id),
			});
		} catch (error) {
			console.error("Error deleting entry:", error);
		}
	},
}));

export default useEntriesStore;

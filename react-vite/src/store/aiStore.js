import { create } from "zustand";
import {
	fetchAIInteractions,
	fetchAIInteractionById,
	createAIInteraction,
	updateAIInteraction,
	deleteAIInteraction,
} from "../utils/api";

const useAIStore = create((set, get) => ({
	aiInteractions: [],
	currentInteraction: null,
	loading: false,
	error: null,

	// Fetch all interactions
	loadAIInteractions: async () => {
		set({ loading: true, error: null });
		try {
			const interactions = await fetchAIInteractions();
			set({ aiInteractions: interactions, loading: false });
		} catch (error) {
			console.error("Failed to load AI interactions:", error);
			set({ error: error.message, loading: false });
		}
	},

	// Fetch a single interaction
	loadAIInteraction: async (id) => {
		set({ loading: true, error: null });
		try {
			const interaction = await fetchAIInteractionById(id);
			set({ currentInteraction: interaction, loading: false });
		} catch (error) {
			console.error("Failed to load interaction by ID:", error);
			set({ error: error.message, loading: false });
		}
	},

	// Create a new interaction
	createInteraction: async (data) => {
		set({ loading: true, error: null });
		try {
			const newInteraction = await createAIInteraction(data);
			set((state) => ({
				aiInteractions: [newInteraction, ...state.aiInteractions],
				currentInteraction: newInteraction,
				loading: false,
			}));
			return newInteraction;
		} catch (error) {
			console.error("Failed to create AI interaction:", error);
			set({ error: error.message, loading: false });
			return null;
		}
	},

	// Update an interaction
	updateInteraction: async (id, data) => {
		set({ loading: true, error: null });
		try {
			const updated = await updateAIInteraction(id, data);
			set((state) => ({
				aiInteractions: state.aiInteractions.map((item) =>
					item.id === id ? updated : item
				),
				currentInteraction: updated,
				loading: false,
			}));
			return updated;
		} catch (error) {
			console.error("Failed to update AI interaction:", error);
			set({ error: error.message, loading: false });
			return null;
		}
	},

	// Delete interaction
	deleteInteraction: async (id) => {
		set({ loading: true, error: null });
		try {
			await deleteAIInteraction(id);
			set((state) => ({
				aiInteractions: state.aiInteractions.filter((item) => item.id !== id),
				currentInteraction:
					state.currentInteraction?.id === id ? null : state.currentInteraction,
				loading: false,
			}));
		} catch (error) {
			console.error("Failed to delete AI interaction:", error);
			set({ error: error.message, loading: false });
		}
	},

	clearCurrentInteraction: () => set({ currentInteraction: null }),
}));

export default useAIStore;

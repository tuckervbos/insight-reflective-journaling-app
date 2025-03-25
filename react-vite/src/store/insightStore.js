import { create } from "zustand";
import {
	fetchInsights,
	fetchInsightById,
	createInsight,
	updateInsight,
	deleteInsight,
} from "../utils/api";

const useInsightStore = create((set, get) => ({
	insights: [],
	currentInsight: null,
	loading: false,
	error: null,

	loadInsights: async () => {
		set({ loading: true, error: null });
		try {
			const data = await fetchInsights();
			set({ insights: data, loading: false });
		} catch (error) {
			console.error("Failed to load insights:", error);
			set({ error: error.message, loading: false });
		}
	},

	loadInsight: async (id) => {
		set({ loading: true, error: null });
		try {
			const data = await fetchInsightById(id);
			set({ currentInsight: data, loading: false });
		} catch (error) {
			console.error("Failed to load insight:", error);
			set({ error: error.message, loading: false });
		}
	},

	createInsight: async (data) => {
		set({ loading: true, error: null });
		try {
			const newInsight = await createInsight(data);
			set((state) => ({
				insights: [newInsight, ...state.insights],
				currentInsight: newInsight,
				loading: false,
			}));
			return newInsight;
		} catch (error) {
			console.error("Failed to create insight:", error);
			set({ error: error.message, loading: false });
			return null;
		}
	},

	updateInsight: async (id, data) => {
		set({ loading: true, error: null });
		try {
			const updated = await updateInsight(id, data);
			set((state) => ({
				insights: state.insights.map((item) =>
					item.id === id ? updated : item
				),
				currentInsight: updated,
				loading: false,
			}));
			return updated;
		} catch (error) {
			console.error("Failed to update insight:", error);
			set({ error: error.message, loading: false });
			return null;
		}
	},

	deleteInsight: async (id) => {
		set({ loading: true, error: null });
		try {
			await deleteInsight(id);
			set((state) => ({
				insights: state.insights.filter((item) => item.id !== id),
				currentInsight:
					state.currentInsight?.id === id ? null : state.currentInsight,
				loading: false,
			}));
		} catch (error) {
			console.error("Failed to delete insight:", error);
			set({ error: error.message, loading: false });
		}
	},

	clearCurrentInsight: () => set({ currentInsight: null }),
}));

export default useInsightStore;

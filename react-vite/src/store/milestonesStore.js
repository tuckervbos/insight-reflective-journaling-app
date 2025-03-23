import { create } from "zustand";
import {
	fetchMilestones,
	fetchMilestoneById,
	createMilestone,
	updateMilestone,
	deleteMilestone,
} from "../utils/api";

const useMilestonesStore = create((set) => ({
	milestones: [],
	milestone: null,

	// Fetch all milestones, optionally filter by status
	fetchMilestones: async (status = null) => {
		try {
			const data = await fetchMilestones(status);
			console.log("Fetched Milestones from API:", data);
			set({ milestones: data });
		} catch (error) {
			console.error("Error in store fetchMilestones function:", error);
			set({ milestones: [] });
		}
	},

	// Fetch a specific milestone by ID
	fetchMilestoneById: async (id) => {
		try {
			const milestone = await fetchMilestoneById(id);
			set((state) => ({
				milestones: state.milestones.map((m) => (m.id === id ? milestone : m)),
				milestone,
			}));
			return milestone;
		} catch (error) {
			console.error("Error in store fetchMilestoneById function:", error);
			return null;
		}
	},

	// Create a new milestone
	createMilestone: async (milestoneData) => {
		try {
			console.log("Attempting to create milestone with data:", milestoneData);
			const newMilestone = await createMilestone(milestoneData);
			console.log("Milestone created in store:", newMilestone);
			set((state) => ({
				milestones: [...state.milestones, newMilestone],
			}));
			await fetchMilestones();
			return newMilestone;
		} catch (error) {
			console.error("Error in store createMilestone function:", error);
			throw error;
		}
	},

	// Update an existing milestone
	updateMilestone: async (id, updatedData) => {
		try {
			const updatedMilestone = await updateMilestone(id, updatedData);
			set((state) => ({
				milestones: state.milestones.map((m) =>
					m.id === id ? updatedMilestone : m
				),
			}));
		} catch (error) {
			console.error("Error in store updateMilestone function:", error);
		}
	},

	// Delete a milestone
	deleteMilestone: async (id) => {
		try {
			await deleteMilestone(id);
			set((state) => ({
				milestones: state.milestones.filter((m) => m.id !== id),
			}));
		} catch (error) {
			console.error("Error in store deleteMilestone function:", error);
		}
	},

	// Clear all milestones
	clearMilestones: () => set({ milestones: [], milestone: null }),
}));

export default useMilestonesStore;

import { create } from "zustand";
import {
	fetchGoals,
	fetchGoalById,
	createGoal,
	updateGoal,
	deleteGoal,
	fetchEntriesForGoal,
} from "../utils/api";

const useGoalsStore = create((set) => ({
	goals: [],
	associatedEntries: [],

	// Fetch all goals with pagination
	fetchGoals: async (page = 1, perPage = 10) => {
		const data = await fetchGoals(page, perPage);
		set({ goals: data.goals });
	},

	// Fetch a specific goal by ID
	fetchGoalById: async (id) => {
		try {
			const goal = await fetchGoalById(id);
			set((state) => ({
				goals: state.goals.map((g) => (g.id === id ? goal : g)),
			}));
			return goal;
		} catch (error) {
			return null;
		}
	},

	fetchEntriesForGoal: async (goalId) => {
		try {
			const entries = await fetchEntriesForGoal(goalId);
			set({ associatedEntries: entries || [] });
		} catch (error) {
			set({ associatedEntries: [] });
		}
	},

	// Create a new goal
	createGoal: async (goalData) => {
		const newGoal = await createGoal(goalData);
		set((state) => ({ goals: [...state.goals, newGoal] }));
	},

	// Update an existing goal
	updateGoal: async (id, updatedData) => {
		const updatedGoal = await updateGoal(id, updatedData);
		set((state) => ({
			goals: state.goals.map((goal) => (goal.id === id ? updatedGoal : goal)),
		}));
	},

	// Delete a goal
	deleteGoal: async (id) => {
		await deleteGoal(id);
		set((state) => ({
			goals: state.goals.filter((goal) => goal.id !== id),
		}));
	},

	// Clear all goals
	clearGoals: () => set({ goals: [], associatedEntries: [] }),
}));

export default useGoalsStore;

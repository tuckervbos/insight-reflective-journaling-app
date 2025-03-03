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
	//refactor later
	fetchGoals: async (page = 1, perPage = 1000000) => {
		const data = await fetchGoals(page, perPage);
		console.log("Fetched Goals from API:", data.goals);
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
		try {
			console.log("Attempting to create goal with data:", goalData); // ✅ Add log
			const newGoal = await createGoal(goalData);
			console.log("Goal created in store:", newGoal); // ✅ Add log
			set((state) => ({ goals: [...state.goals, newGoal] }));
			await fetchGoals();
			return newGoal;
		} catch (error) {
			console.error("Error in store createGoal function:", error);
			throw error;
		}
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

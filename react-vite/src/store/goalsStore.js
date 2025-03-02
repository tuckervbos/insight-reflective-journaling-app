import { create } from "zustand";
import {
	fetchGoals,
	fetchGoalById,
	createGoal,
	updateGoal,
	deleteGoal,
	fetchGoalsForEntry,
} from "../utils/api";

const useGoalsStore = create((set) => ({
	goals: [],

	// Fetch all goals with pagination
	fetchGoals: async (page = 1, perPage = 10) => {
		try {
			const data = await fetchGoals(page, perPage);
			set({ goals: data.goals });
		} catch (error) {
			console.error("Error fetching goals:", error);
		}
	},

	// Fetch a specific goal by ID
	fetchGoalById: async (id) => {
		try {
			const goal = await fetchGoalById(id);
			set((state) => ({
				goals: state.goals.map((g) => (g.id === id ? goal : g)),
			}));
		} catch (error) {
			console.error("Error fetching goal by ID:", error);
		}
	},

	// Create a new goal
	createGoal: async (goalData) => {
		try {
			const newGoal = await createGoal(goalData);
			set((state) => ({ goals: [...state.goals, newGoal] }));
		} catch (error) {
			console.error("Error creating goal:", error);
		}
	},

	// Update an existing goal
	updateGoal: async (id, updatedData) => {
		try {
			const updatedGoal = await updateGoal(id, updatedData);
			set((state) => ({
				goals: state.goals.map((goal) => (goal.id === id ? updatedGoal : goal)),
			}));
		} catch (error) {
			console.error("Error updating goal:", error);
		}
	},

	// Delete a goal
	deleteGoal: async (id) => {
		try {
			await deleteGoal(id);
			set((state) => ({
				goals: state.goals.filter((goal) => goal.id !== id),
			}));
		} catch (error) {
			console.error("Error deleting goal:", error);
		}
	},

	// Fetch goals associated with a specific entry
	fetchGoalsForEntry: async (entryId) => {
		try {
			const entryGoals = await fetchGoalsForEntry(entryId);
			set((state) => ({
				goals: [
					...state.goals.filter(
						(goal) => !entryGoals.find((eg) => eg.id === goal.id)
					),
					...entryGoals,
				],
			}));
		} catch (error) {
			console.error("Error fetching goals for entry:", error);
		}
	},
	// Clear all goals
	clearGoals: () => set({ goals: [] }),
}));

export default useGoalsStore;

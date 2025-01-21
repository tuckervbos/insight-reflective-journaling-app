import { create } from "zustand";

const useSessionStore = create((set) => ({
	user: null,
	setUser: (user) => set({ user }),
	clearUser: () => set({ user: null }),
}));

export default useSessionStore;

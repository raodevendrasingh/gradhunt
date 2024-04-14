import { create } from "zustand";

export const useStore = create((set) => ({
	userType: null,
	setUserType: (type) => set(() => ({ userType: type })),
	userName: null,
	setUserName: (uname) => set(() => ({ userName: uname })),
}));
